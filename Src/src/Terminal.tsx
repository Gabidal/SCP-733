import React from 'react';
import './style.css';
import {Post_Process_text} from './main'


function Process_Text(Input: any){
    return Input
}

// Contains a vertical side menu bar, and the rest is a terminal window
export default function Terminal(){
    const [Input_Text, Set_Input_Text] = React.useState("");
    const [Paragraph_Text, Set_Paragraph_Text] = React.useState("");

    function Handle_Input(e: React.ChangeEvent<HTMLInputElement>) {
        Set_Input_Text(e.target.value);
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            if (Input_Text.length <= 0){
                return
            }
            
            const Input_Text_With_New_Line = "\n" + Process_Text(Input_Text)
            
            // flush input field
            Set_Input_Text("");
            
            Set_Paragraph_Text(Paragraph_Text + Post_Process_text(Input_Text_With_New_Line))

            var elem = document.getElementById('PARAGRAPH')!;
            elem.scrollTo({top: elem.scrollHeight});
        }
    }

    return (
        <div className="SCP-Terminal">
            <div className="SCP-Terminal-Content">
            <p id='PARAGRAPH' dangerouslySetInnerHTML={{ __html: Paragraph_Text }}></p>
            </div>

            <div className="SCP-Terminal-Input">
                <input 
                type="text"
                value={Input_Text}
                onChange={Handle_Input}
                onKeyDown={handleKeyDown} 
                autoFocus
                />
            </div>
        </div>
    )
}