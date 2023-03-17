import React from 'react';
import './style.css';
import Abstract from './abstract';
import 'bootstrap/dist/css/bootstrap.min.css';

// This enum describes what page (state) is rendered into the DOM.
const Values = {
    MAIN: 0,
    ABSTRACT: 1,
}

export default function SCP() {
    const [Page, Set_Page] = React.useState(Values.MAIN);

    var Content

    if (Page === Values.MAIN) {
        Content = <Main/>
    }
    else if (Page === Values.ABSTRACT) {
        Content = <Abstract/>
    }

    return (
        <div className="SCP">
            <div className="Content">
                <div className="SCP-SideMenu">
                    <div className="SCP-SideMenu-Item">
                        <button 
                            onClick={() => Set_Page(Values.MAIN)}
                            className={Get_Button_Activation_Class(Page, Values.MAIN)}
                        >
                            Terminal
                        </button>
                        <button
                            onClick={() => Set_Page(Values.ABSTRACT)}
                            className={Get_Button_Activation_Class(Page, Values.ABSTRACT)}
                        >
                            Abstract
                        </button>
                    </div>
                </div>

                {Content}
            </div>
        </div>
    );
}

function Terminal(Input: any){
    return Input
}

// Contains a vertical side menu bar, and the rest is a terminal window
function Main(){
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

            var elem = document.getElementById('PARAGRAPH')!;
            elem.scrollTo({top: elem.scrollHeight});

            const Input_Text_With_New_Line = "\n" + Terminal(Input_Text)
            
            // flush input field
            Set_Input_Text("");
            
            Set_Paragraph_Text(Paragraph_Text + Post_Process_text(Input_Text_With_New_Line))
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

function Get_Button_Activation_Class(Page: number, prefer: number){
    if (Page === prefer){
        return "Active";
    }
    else{
        return "De_Active";
    }
}

function Post_Process_text(inputText: string) {
    const crossedOutWords = ['bad', 'wrong'];
    const underlinedWords = ['good', 'right'];
    const linkedWords = {
        'Google': 'https://www.google.com',
        'GitHub': 'https://github.com'
    };
  
    let formattedText = inputText;
    
    // Cross out words
    crossedOutWords.forEach(word => {
        formattedText = formattedText.replace(new RegExp(word, 'g'), `<s>${word}</s>`);
    });
    
    // Underline words
    underlinedWords.forEach(word => {
        formattedText = formattedText.replace(new RegExp(word, 'g'), `<u>${word}</u>`);
    });
    
    // Add links
    Object.entries(linkedWords).forEach(([word, link]) => {
        formattedText = formattedText.replace(new RegExp(word, 'g'), `<a href="${link}">${word}</a>`);
    });
    
    // Replace newlines with <br> tags
    //formattedText = formattedText.replace('_', '<br/>');
  
    return formattedText;
}
  

