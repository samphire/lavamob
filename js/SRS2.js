function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Update an item's scheduling after a review.
 * @param {Object} card - your record for this item
 * @param {boolean} wasCorrect
 * @returns {Object} - { nextIntervalDays, retire, suspend }
 */
function updateSRS(card, wasCorrect) {
    // Ensure defaults
    let EF = card.EF ?? 2.5;
    let repnum = card.repnum ?? 0;
    let streak = card.streak ?? 0;
    let lastI = card.lastIntervalDays ?? 0;
    let lapses = card.lapses ?? 0;

    // --- 1) Easiness update (SM-2 style, binary mapped) ---
    const q = wasCorrect ? 5 : 2; // 5 = perfect, 2 = fail (still “attempted”)
    EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    EF = clamp(EF, 1.3, 3.0);

    // --- 2) Interval & counters ---
    let interval;
    if (wasCorrect) {
        streak += 1;
        repnum += 1;

        if (repnum === 1) {
            interval = 1;            // I(1)
        } else if (repnum === 2) {
            interval = 2;            // I(2)
        } else if (repnum === 3){
            interval = 4;
        }
        else {
            interval = Math.round(Math.max(1, lastI * EF)); // I(n) = I(n-1) * EF
        }
    } else {
        // Lapse: reset streak, keep/decide on repnum policy
        streak = 0;
        lapses += 1;
        interval = 1;              // relearn tomorrow (daily system)
        // Optionally: repnum = Math.max(0, repnum - 1);
    }

    // --- 3) Fuzz the interval ±15% to avoid clumping ---
    interval = Math.max(1, Math.round(interval * (1 + randomInRange(-0.15, 0.15))));

    // --- 4) Retirement / Leech logic ---
    const retire = (interval >= 365) && (streak >= 8) && (EF >= 2.5);
    const suspend = (lapses >= 8) && (repnum >= 10); // optional “leech” rule

    // --- 5) Persist updated fields back to your card ---
    card.EF = EF;
    card.repnum = repnum;
    card.streak = streak;
    card.lastIntervalDays = interval;
    card.lapses = lapses;

    return { nextIntervalDays: interval, retire, suspend };
}

/**
 * Example wire-up with your existing calcDateNext(days)
 */
function onAnswer(card, wasCorrect) {
    const { nextIntervalDays, retire, suspend } = updateSRS(card, wasCorrect);

    if (retire) {
        // remove from learning list (archive or mark retired)
        archiveCard(card); // implement this in your app
        return;
    }
    if (suspend) {
        markAsLeech(card); // implement this in your app (separate remedial flow)
        return;
    }

    calcDateNext(card, nextIntervalDays); // your function to schedule the next date
}
