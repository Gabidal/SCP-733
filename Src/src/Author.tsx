import { AUTHOR_LOCATIONS } from "./DB";
import { Get_File } from "./File";
import { Logger } from "./Logger";

// This is a connection class, for speeding up queries.
export class Author_Has_Paper{
    ID: number = 0;

    Paper_ID: number = 0;
}

export default class Author{
    ID: number = 0;

    First_Name: string = "";
    Last_Name: string = "";
}

var Author_Cache = new Map<string, Author>();

// the Authors are stored as json files.
export function Parse_Author_File(raw_Buffer: string): Author | null{
    var Result: Author = new Author();

    try{
        JSON.parse(raw_Buffer, (key: string, value: any) => {
            if (key == "ID"){
                Result.ID = parseInt(value);
            }
            else if (key == "First_Name"){
                Result.First_Name = value;
            }
            else if (key == "Last_Name"){
                Result.Last_Name = value;
            }
        });
    }
    catch (e){
        Logger.Log("ERROR: Could not parse author file: " + e);
        return null;
    }

    return Result;
}

// finds the author from DB:AUTHOR_LOCATIONS if not exist, return null.
export function Find_Author(Full_Name: string): Author | null{
    // Check if the author is found from the cache
    if (Author_Cache.has(Full_Name)){
        return Author_Cache.get(Full_Name)!;
    }

    // Sanitize the name if it contains whitespace.
    var Sanitized_Full_Name = Full_Name.replace(/ /g, "_");

    let Result_Buffer = Get_File(AUTHOR_LOCATIONS + Sanitized_Full_Name + ".txt");

    if (Result_Buffer == null){
        Logger.Log("NOTICE: Could not locate author: '" + Full_Name + "'.");

        return null;
    }

    var Result = Parse_Author_File(Result_Buffer);

    // save the result to the cache before returning it.
    Author_Cache.set(Full_Name, Result!);

    return Result;
}
