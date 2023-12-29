import React from 'react';
import './style.css';
import Abstract from './abstract';
import Terminal from './Terminal';
import File from './File';
import 'bootstrap/dist/css/bootstrap.min.css';

// This enum describes what page (state) is rendered into the DOM.
const Values = {
    TERMINAL: 0,
    ABSTRACT: 1,
    FILE: 2,
}

export default function SCP() {
    const [Page, Set_Page] = React.useState(Values.TERMINAL);

    var Content

    if (Page === Values.TERMINAL) {
        Content = <Terminal/>
    }
    else if (Page === Values.ABSTRACT) {
        Content = <Abstract/>
    }
    else if (Page === Values.FILE) {
        Content = <File/>
    }

    return (
        <div className="SCP">
            <div className="Content">
                <div className="SCP-SideMenu">
                    <div className="SCP-SideMenu-Item">
                        <button 
                            onClick={() => Set_Page(Values.TERMINAL)}
                            className={Get_Button_Activation_Class(Page, Values.TERMINAL)}
                        >
                            Terminal
                        </button>
                        <button
                            onClick={() => Set_Page(Values.ABSTRACT)}
                            className={Get_Button_Activation_Class(Page, Values.ABSTRACT)}
                        >
                            Abstract
                        </button>
                        <button
                            onClick={() => Set_Page(Values.FILE)}
                            className={Get_Button_Activation_Class(Page, Values.FILE)}
                        >
                            File
                        </button>
                    </div>
                </div>

                {Content}
            </div>
        </div>
    );
}

function Get_Button_Activation_Class(Page: number, prefer: number){
    if (Page === prefer){
        return "Active";
    }
    else{
        return "De_Active";
    }
}

export function Post_Process_text(inputText: string) {
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
  

