
import React, { useCallback, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import samplePDF from './Black–Scholes_equation.pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();
function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [highlights, setHighlights] = useState([]);


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber(prevPageNumber => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1)
  }
  function chnagePageNext() {
    changePage(+1)
  }

  function highlightPattern(text, pattern) {
    let highlightedText = text;
  
    pattern.forEach(term => {
      const regex = new RegExp(term, "gi");
      highlightedText = highlightedText.replace(regex, (match) => `<mark>${match}</mark>`);
    });
  
    return highlightedText;
  }

  const initialSearchText = ["equation", "derivative"]; 
  const [searchText, setSearchText] = useState(initialSearchText);

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function onChange(event) {
    setSearchText(event.target.value);
  }



  return (
    <div className="App">
      <div style={{ width: '500px', height: '500px', overflow: 'auto' }}>
      
        <div>
          <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(
              new Array(numPages),
              (el, index) =>
                <Page
                  key={'page_${index+1}'}
                  pageNumber={index + 1}
                  customTextRenderer={textRenderer}

                />

            )}
          </Document>
          <div style={{ display: 'none' }}>
            
            <input type="search" id="search" value={searchText} onChange={onChange} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
