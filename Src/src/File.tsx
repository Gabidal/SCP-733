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

export function Update_File(File_Name: string, Buffer: string){
    // opens file and puts the data in.
    fs.writeFileSync(File_Name, Buffer);
}

// Takes an lambda as an parameter and computes it for all the files inside a dir.
export function Do_For_Files(Dir: string, fx: ((dir: string, file: string) => {})){

    // Open the folder
    const dir = fs.opendirSync(Dir);

    // Read all the files
    let dirent;
    while ((dirent = dir.readSync()) !== null) {
        if (dirent.isFile()){
            fx(Dir, dirent.name);
        }
    }
}
