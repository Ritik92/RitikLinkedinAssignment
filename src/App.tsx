import React, { useState, useEffect, useRef } from 'react';
import { Send, PaperclipIcon, SmileIcon } from 'lucide-react';
import Frame from './Frame.png';  // Make sure this path is correct
const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [prompt, setprompt] = useState('');
  const [response, setResponse] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || (target.tagName === 'DIV' && target.getAttribute('role') === 'textbox')) {
        console.log('setting true')
        setIsVisible(true);
      }
    };

    const handleBlur = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || (target.tagName === 'DIV' && target.getAttribute('role') === 'textbox')) {
        if (!showModal && event.relatedTarget !== buttonRef.current) {
          setIsVisible(false);
          console.log('setting false')
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGenerate = () => {
    setShowModal(true)
    setShowModal1(false)
 
    setResponse("Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.");
  };

const handleInsert = () => {
  const linkedInInput = document.querySelector('.msg-form__contenteditable[contenteditable="true"]');
  if (linkedInInput && linkedInInput instanceof HTMLElement) {
  
    const originalContent = linkedInInput.textContent || '';
    const selection = window.getSelection();
    const originalRange = selection?.getRangeAt(0).cloneRange();

    
    const simulateTyping = (text: string) => {
      let index = 0;
      const type = () => {
        if (index < text.length) {
       
          const char = text[index];
          const textNode = document.createTextNode(char);
          selection?.getRangeAt(0).insertNode(textNode);
          selection?.collapseToEnd();

        
          const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: char
          });
          linkedInInput.dispatchEvent(inputEvent);

          index++;
          setTimeout(type, 10);
        } else {
     
          linkedInInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      type();
    };


    let textToInsert = response.trim();
    if (originalContent && !originalContent.endsWith(' ')) {
      textToInsert = ' ' + textToInsert;
    }

 
    if (!selection?.rangeCount) {
      const range = document.createRange();
      range.selectNodeContents(linkedInInput);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }


    simulateTyping(textToInsert);

 
    linkedInInput.focus();
  }
  setShowModal(false);
};
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setShowModal1(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleButtonClick = () => {
    setIsVisible(true);
    setShowModal1(true);
  };
  const handleChange = (event:any) => {
    setprompt(event.target.value); 
  };
  const handleInsertImage = () => {
    const linkedInInput = document.querySelector('.msg-form__contenteditable[contenteditable="true"]');
    
    if (linkedInInput) {
      const inputElement = linkedInInput as HTMLElement;
      let img = inputElement.querySelector('#ai-assistant-img') as HTMLImageElement;
      
      if (isVisible) {
        if (!img) {
        
          img = document.createElement('img');
          img.id = 'ai-assistant-img';
          img.src = Frame;
          img.alt = 'Frame';
          img.className = 'absolute bottom-1 right-1 z-50 text-white p-2 rounded-2xl cursor-pointer';
          img.style.position = 'absolute';
          img.style.bottom = '10px';
          img.style.right = '10px';
          img.style.zIndex = '100';
  
          inputElement.style.position = 'relative';
          inputElement.appendChild(img);
  
          img.addEventListener('click', handleButtonClick);
        }
     
        img.style.display = 'block';
      } else {
      
        if (img) {
          img.style.display = 'none';
        }
      }
    }
  };
  
  useEffect(() => {
    handleInsertImage();
  }, [isVisible]);
  return (
    <>
      
      {showModal && (
         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
         <div ref={modalRef} className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
           <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
           <div className="mb-4 space-y-2">
             {prompt && (
               <div className="flex justify-end">
                 <div className="bg-gray-100 p-3 rounded-lg max-w-[70%]">
                   {prompt}
                 </div>
               </div>
             )}
             {response && (
               <div className="flex justify-start">
                 <div className="bg-blue-100 p-3 rounded-lg max-w-[70%]">
                   {response}
                 </div>
               </div>
             )}
           </div>
           <textarea 
             ref={inputRef}
             className="w-full p-2 border rounded mb-4"
             placeholder="Your prompt"
             rows={3} 
             onChange={(e) => setprompt(e.target.value)}
           />
           <div className="flex justify-between">
             <button 
               onClick={handleInsert}
               className="bg-blue-500 text-white px-4 py-2 rounded"
             >
               Insert
             </button>
             <button 
               onClick={handleGenerate}
               className="bg-blue-500 text-white px-4 py-2 rounded"
             >
               Generate
             </button>
           </div>
         </div>
       </div>
      )}
       {showModal1 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">AI  Assistant</h2>
            <div className="mb-4">
              <textarea 
                ref={inputRef}
                className="w-full p-2 border rounded"
                placeholder="Your prompt"
                rows={3}
                onChange={handleChange} 
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleGenerate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;