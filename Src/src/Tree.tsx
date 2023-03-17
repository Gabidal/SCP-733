// Examples of Tree branch path:
// Domain_Name://.../Continent/Time_Frame:Start-End/Country/State/City/Street/Building/Room/Exact_Time_Frame:Start-End
// Domain_Name://.../Place_A/Time_Frame_A/Place_B/Time_Frame_B/../Place_N/Time_Frame_N
// We need to lex the path string and make assumptions based on the string given.

const Content_Types = {
    FOLDER: 0,
    // Everything from now on are files.
    Author: 1,
    Paper: 2,
    Misc: 3,
}

export class Content{
    Name: string = "";
    Type: number = Content_Types.Misc;
    
    Parent: Content | null = null;
    Children: Array<Content> = [];
}

// Cut the given string to a array of path indices
export function Cut_Path(path: string): Array<string> {
    var Path_Array = path.split("/");
    var New_Path_Array: Array<string> = [];
    for (var i = 0; i < Path_Array.length; i++) {
        if (Path_Array[i].length > 0) {
            New_Path_Array.push(Path_Array[i]);
        }
    }
    return New_Path_Array;
}

// construct linked list from the cut list of path indices.
export function Content_Factory(instanses: Array<string>): Content {
    var Root = new Content();
    Root.Name = instanses[0];
    Root.Type = Content_Types.FOLDER;
    var Current_Content = Root;
    for (var i = 1; i < instanses.length; i++) {
        var New_Content = new Content();
        New_Content.Name = instanses[i];
        New_Content.Parent = Current_Content;
        Current_Content.Children.push(New_Content);
        Current_Content = New_Content;
    }
    return Root;
}



