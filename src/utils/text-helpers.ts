export const cleanUpText = (text: string) => {
    text = text.replace(/[&\/\\#,+()!$~%.'":*?<>{}]/g, ''); // Removes special characters (besides hyphens)
    text = text.replace(/\s+/g, ';'); // Replaces all whitespaces with a semicolon for easier splitting

    console.log(text.toLowerCase());

    return text.toLowerCase();
};