export function formatErrorMessage(err: Error) {
    console.log("🚀 ~ formatErrorMessage ~ err:", err)
    if(err?.message) {
        let message: string = err.message;
        if(message.search("Error:") && message.search("Contract Call:")) {
            message = message.split("Error:")[1].split("Contract Call:")[0];
        }
        return message;
    }
    else {
        return "Unknown Error";
    }
}