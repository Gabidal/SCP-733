// Here we will define what a paper is, and how to lex an paper and save it as an abstract obj.
// For the ease of use for the user to create papers and store them into the SCP archive system, we will need to support different formats of paper.
// When an paper is analyzed it is stored in a respective folder tree, where the folders are how the Archival system will later on find the respective paper.

import { Find_Author } from "./Author";
import { HEADER_SIZE } from "./DB";
import { Logger } from "./Logger";


export class Paper_Has_Author{
    ID: number = 0;

    Author_ID: number = 0;

    constructor(paper_ID: number, author_ID: number){
        this.ID = paper_ID;
        this.Author_ID = author_ID;
    }
}

export default class Paper{
    ID: number = 0;

    Title: string = "";
    Description: string = "";

    Date: Date = new Date();
    Location: string = "";

    Lead_Authors: Array<Paper_Has_Author> = [];
    Other_Contributors: Array<Paper_Has_Author> = [];

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
    
        Result.Lead_Authors.push(new Paper_Has_Author(Result.ID, Find_Author(Lead_Author)?.ID!));
        Result.Other_Contributors = Other_Contributors.map((author) => new Paper_Has_Author(Result.ID, Find_Author(author)?.ID!));
    }
    else{
        Logger.Log("Failed to find author(s) in paper: " + Result.ID + "\n")
    }

    return Result;
}

// Extract the date and location the paper refers to.
export function Extract_Date_And_Location(paper: Paper){

    // First try to get the needed information from the headers.


}
