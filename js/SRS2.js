// function clamp(val, min, max) {
//     return Math.max(min, Math.min(max, val));
// }
//
// function randomInRange(min, max) {
//     return Math.random() * (max - min) + min;
// }


const KIDS_BOOTSTRAP = [1, 2, 4, 6, 10, 16];
const EF_MIN = 1.3, EF_MAX = 3.0;
const FUZZ = 0.10;

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function jitter(days) {
    const f = 1 + (Math.random() * 2 * FUZZ - FUZZ);
    return Math.max(1, Math.round(days * f));
}


/**
 * Update an item's scheduling after a review.
 * @param {Object} card - your record for this item
 * @param {boolean} wasCorrect
 * @returns {Object} - { nextIntervalDays, retire, suspend }
 */
function updateSRS(card, wasCorrect) {

    // defaults
    let EF = card.EF ?? 2.5;
    let rep = card.repnum ?? 0;
    let streak = card.streak ?? 0;
    let lastI = card.lastIntervalDays ?? 0;
    let lapses = card.lapses ?? 0;

    // EF update (SM-2 style, binary mapped)
    const q = wasCorrect ? 5 : 2;
    EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    EF = clamp(EF, EF_MIN, EF_MAX);

    let interval;

    if (wasCorrect) {
        rep += 1;
        streak += 1;

        if (rep <= KIDS_BOOTSTRAP.length) {
            interval = KIDS_BOOTSTRAP[rep - 1];
        } else {
            const base = lastI > 0 ? lastI : KIDS_BOOTSTRAP[KIDS_BOOTSTRAP.length - 1];
            const growthFactor = 1 + 0.24 * EF;
            interval = Math.round(base * growthFactor);
        }
    } else {
        lapses = card.isFlashCard ? 0 : lapses + 1;
        streak = 0;
        // console.log("here is the wrongly answered card after mod in SRS2: ", card);

        if (rep <= 2 || lastI <= 4) {
            interval = 1;
        } else {
            const base = lastI > 0
                ? lastI
                : (rep <= KIDS_BOOTSTRAP.length
                    ? KIDS_BOOTSTRAP[rep - 1]
                    : KIDS_BOOTSTRAP[KIDS_BOOTSTRAP.length - 1]);

            const penaltyFactor = 3;
            interval = Math.max(1, Math.round(base / penaltyFactor));
        }

    }

    interval = jitter(interval);

    // retire at the 10th success (your target)
    const retire = wasCorrect && rep >= 9 && streak >= 4 && interval >= 60;

    // (Optional) “leech” suspend rule—tune to taste
    const leech = lapses >= 8 && rep >= 6;

    // persist back on the same object
    card.EF = EF;
    card.repnum = rep;
    card.streak = streak;
    card.lastIntervalDays = interval;
    card.lapses = lapses;

    return {nextIntervalDays: interval, retire, leech};
}

/**
 * Example wire-up with your existing calcDateNext(days)
 */
function onAnswer(card, wasCorrect) {
    const {nextIntervalDays, retire, suspend} = updateSRS(card, wasCorrect);

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
