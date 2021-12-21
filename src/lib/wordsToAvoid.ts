export function getStartingWordsToAvoid(): Map<string, number> {
    let values = {
        "a": 50,
        "and": 0,
        "to": 0,
        "at": 0,
        "it": 0,
        "its": 50,
    };

    return new Map(Object.entries(values));
}

export function getEndingWordsToAvoid(): Map<string, number> {
    let values = {
        "i": 0,
        "a": 0,
        "have": 0,
        "if": 0,
        "it": 0,
        "and": 0,
        "to": 0,
        "of": 0,
        "but": 0,
        "is": 0,
        "are": 0,
        "the": 0,
        "or": 0,
        "in": 50,
        "as": 50,
        "by": 60,
    };

    return new Map(Object.entries(values));
}
