// Here we will define what a paper is, and how to lex an paper and save it as an abstract obj.
// For the ease of use for the user to create papers and store them into the SCP archive system, we will need to support different formats of paper.
// When an paper is analyzed it is stored in a respective folder tree, where the folders are how the Archival system will later on find the respective paper.

import { Allocate, Instance, Preserve } from "./Allocator";
import { Find_Author } from "./Author";
import { HEADER_SIZE } from "./DB";
import { Logger } from "./Logger";

export default class Paper{
    ID: number = 0;

    Title: string = "";
    Description: string = "";

    Date: Date = new Date();
    Location: string = "";

    Lead_Authors: Array<number> = new Array<number>();
    Other_Contributors: Array<number> = new Array<number>();

    Data: string = "";

    constructor(){
    }
}

function Get_Position(s: string, subString: string, index: number) {
    return s.split(subString, index).join(subString).length;
}

export function Parse_Paper_File(raw_Buffer: string): Paper | null{
    var Result = new Paper();

    var Cut_Buffer = raw_Buffer.split("\n")

    let New_Line_Count = Cut_Buffer.length;

    let No_Headers = New_Line_Count <= HEADER_SIZE + 1;

    if (No_Headers){
        // If this condition is met, then the file in question doesn't have any headers.
        // TODO: Ask the user the give the header information manually, with a popup prompt form.
        return null;
    }

    // Get the index in which the headers end.
    let Header_End_Index = Get_Position(raw_Buffer, "\n", HEADER_SIZE);

    // substr the headers from the main body.
    let Header = raw_Buffer.substring(0, Header_End_Index);

    // now we can use regex to find the date.
    // (\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})
    let Rgx = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/g;
    let Paper_Date = Rgx.exec(Header);

    if (Date != null){
        Result.Date = new Date(Paper_Date![0]);
    }
    else{
        Logger.Log("Failed to find date in paper: " + Result.ID + "\n")
    }


    // now extract the author name(s)
    // The author names are differentiated by comma.
    // The first author is the lead author, and the rest are other contributors.
    let Author_Rgx = /([A-Za-z]+, )+/g;
    let Authors = Author_Rgx.exec(Header);

    if (Authors != null){
        let Authors_Array = Authors[0].split(", ");
        let Lead_Author = Authors_Array[0];
        let Other_Contributors = Authors_Array.slice(1);
    
        Result.Lead_Authors.push(Find_Author(Lead_Author)?.ID!);
        Result.Other_Contributors = Other_Contributors.map((author) => Find_Author(author)?.ID!);
    }
    else{
        Logger.Log("Failed to find author(s) in paper: " + Result.ID + "\n")
    }

    // Now we need to extract the Title.
    let Title_Rgx = /Title: .+/g;
    let Title = Title_Rgx.exec(Header);

    if (Title != null){
        Result.Title = Title[0].substring(7);
    }
    else{
        Logger.Log("Failed to find title in paper: " + Result.ID + "\n")
    }

    // Now we need tro extract the link that the paper links to
    let Link_Rgx = /Link: .+/g;
    let Link = Link_Rgx.exec(Header);

    if (Link != null){
        Result.Location = Link[0].substring(6);
    }
    else{
        Logger.Log("Notice: paper: '" + Result.Title + "' did not contain link to other instances.\n")
    }

    // check if the Paper in question has an ID
    let ID_Rgx = /ID: .+/g;
    let ID = ID_Rgx.exec(Header);

    if (ID != null){
        Result.ID = parseInt(ID[0].substring(4));
    }
    else{
        // The ID could also have been written as "SCP: ..."
        let SCP_Rgx = /SCP: .+/g;
        let SCP_ID = SCP_Rgx.exec(Header);

        if (SCP_ID != null){
            Result.ID = parseInt(SCP_ID[0].substring(5));

            Preserve(Instance.PAPER, Result.ID);
        }

        Result.ID = Allocate(Instance.PAPER);
    }

    return Result;
}

export function Find_Paper_By_ID(ID: number): Paper | null{
    var 


}
