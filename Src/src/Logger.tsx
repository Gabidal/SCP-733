import fs from 'fs';
import { LOGGER_FOLDER } from './DB';

export namespace Logger{
    export function Log(s: string){
        // generate a custom log for every date
        var Logger_File_Name_Date = new Date();

        var Logger_File_Header = "LOG_" + Logger_File_Name_Date.toDateString() + ".txt"

        fs.appendFileSync(LOGGER_FOLDER + Logger_File_Header, s);
    }
}
