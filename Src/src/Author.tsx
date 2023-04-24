import { Instance, Overlaps } from "./Allocator";
import { AUTHOR_LOCATIONS } from "./DB";
import { Get_File, Update_File, Do_For_Files } from "./File";
import { Logger } from "./Logger";

export default class Author{
    ID: number = 0;

    First_Name: string = "";
    Last_Name: string = "";

    Papers: Array<number> = new Array<number>();
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

export function Update_Author_File(author: Author){
    var Sanitized_Full_Name = author.First_Name + "_" + author.Last_Name;

    var Buffer = JSON.stringify(author, null, 4);

    let File_Name = AUTHOR_LOCATIONS + Sanitized_Full_Name + ".txt";

    Update_File(File_Name, Buffer);
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

    if (Overlaps(Instance.AUTHOR, Result!.ID)){
        Logger.Log("ERROR: Author ID: " + Result!.ID + " overlaps with another instance.");
        Logger.Log("Please consider running: 'Update IDs' to fix this issue.")
        return null;
    }

    // save the result to the cache before returning it.
    Author_Cache.set(Full_Name, Result!);

    return Result;
}

export function Fix_Author_IDs(){
    var Local_Allocator_Instances: Map<string, number> = new Map<string, number>();
    var Local_Non_Linear_Allocation: Map<string, Map<number, boolean>> = new Map<string, Map<number, boolean>>();

    // This function simulates new allocation instance, and starts to go trough all the authors and fixes colliding IDs.
    Do_For_Files(AUTHOR_LOCATIONS, (Dir: string, file: string) => {
        
        // Get the author from the file
        let Author = Parse_Author_File(Get_File(Dir + file)!);

        // if the author is not null, then fix the ID.
        if (Author != null){
            let Old_ID = Author.ID;

            // if the instance is not present, then make new one.
            if (!Local_Allocator_Instances.has(Instance.AUTHOR)){
                Local_Allocator_Instances.set(Instance.AUTHOR, 0);
            }

            // get the current ID of the instance
            let Current_ID = Local_Allocator_Instances.get(Instance.AUTHOR)!;

            // if the current ID is not the same as the ID of the author, then fix it.
            if (Current_ID != Author.ID){
                // preserve the ID of the author
                Local_Non_Linear_Allocation.set(Instance.AUTHOR, new Map<number, boolean>());

                let Local_Non_Linear_Allocation_Instance = Local_Non_Linear_Allocation.get(Instance.AUTHOR)!;

                Local_Non_Linear_Allocation_Instance.set(Author.ID, true);

                // set the ID of the author to the current ID
                Author.ID = Current_ID;
            }

            // now we need to go through all the relations the Author has and update those too.
            for (let i = 0; i < Author.Papers.length; i++){
                let Paper_ID = Author.Papers[i];

                // if the ID is not present in the non-linear allocation, then add it.
                

            // increment the ID
            Local_Allocator_Instances.set(Instance.AUTHOR, Current_ID + 1);

            // update the file
            Update_Author_File(Author);
        }

        return true;
    });

}
