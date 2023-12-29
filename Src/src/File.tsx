import React from 'react';
import './style.css';

// This is our file handler.
// Already opened file names
var File_Cache: Array<string> = [];

var Dir_Handle: FileSystemDirectoryHandle;

// The file component returns a list of accessible files.
export default function File(){
    let Files = new Array<string>();

    Do_For_Files('./', (dir: string, file: string) => {
        // Check if the filename ends with *.txt
        if (file.endsWith('.txt')){
            Files.push(file);
        }
    })

    return (
        <div id="ITEM_LIST">

            {/* {generate a list element and populate it with the file names} */}
            {Files.map((value, index) => {
                return <li key={index} /*onClick={}*/>{value}</li>
            })}

        </div>
    )

}

async function Get_Folder_Handler(){
    if (!Dir_Handle || Dir_Handle == null){
        Dir_Handle = await window.showDirectoryPicker()
    }
}

export async function Get_File(File_Name: string){
    var Result: string = "";

    // first try to find it from the cache
    var Cache_Index = File_Cache.indexOf(File_Name);

    if (Cache_Index != -1){
        return File_Cache[Cache_Index];
    }

    try{
        // Make sure that the folder handler is in place
        await Get_Folder_Handler()

        for await (const elem of Dir_Handle.values()){

            if (elem.kind == 'file' && elem){
                
            }

        }
        
    }
    catch (e){
        return "";
    }

    return Result;
}

export function Update_File(File_Name: string, Buffer: string){
    // opens file and puts the data in.
    fs.writeFileSync(File_Name, Buffer);
}

// Takes an lambda as an parameter and computes it for all the files inside a dir.
export function Do_For_Files(Dir: string, fx: ((dir: string, file: string) => void)){

    // Open the folder
    const dir = fs.opendirSync(Dir);

    // Read all the files
    let file;
    while ((file = dir.readSync()) !== null) {
        if (file.isFile()){
            fx(Dir, file.name);
        }
        else if (file.isDirectory()){
            Do_For_Files(Dir + file.name + "/", fx);
        }
    }
}
