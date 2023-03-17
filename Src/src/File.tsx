import fs from 'fs';

// This is our file handler.
// Already opened file names
var File_Cache: Array<string> = [];

export function Get_File(File_Name: string): string | null{
    var Result: string = "";

    // first try to find it from the cache
    var Cache_Index = File_Cache.indexOf(File_Name);

    if (Cache_Index != -1){
        return File_Cache[Cache_Index];
    }

    try{
        Result = fs.readFileSync(File_Name, 'utf8');
    }
    catch (e){
        return null;
    }

    return Result;
}
