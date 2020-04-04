export const cleanUpText = (text: string): string => {
    return text.trim()
        .replace(/[&\/\\#,+()!$~%.'":^|@;\[\]*?<>{}]/g, '') // Removes special characters (besides hyphens)
        .replace(/\s+/g, ';') // Replaces all whitespaces with a semicolon for easier splitting
        .replace(/([0-9]+(?=[a-z])|(?<=[a-z])[0-9]+)/gi, '') // Removes digits attached to words. Leaves standalone digits be
        .toLowerCase();
};