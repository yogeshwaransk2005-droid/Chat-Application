import React, { useRef } from "react";

function FileUpload({ onFileSelect }) {

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {

        fileInputRef.current.click();

    };

    const handleFileChange = (event) => {

        const files = Array.from(event.target.files);

        if (files.length > 0) {

            console.log("Selected Files:", files);

            onFileSelect(files);

        }

    };

    return (

        <div className="file-upload">

           <button
    className="file-btn"
    onClick={handleButtonClick}
>
    📎
</button>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple

                accept="
                    image/*,
                    video/*,
                    audio/*,
                    .pdf,
                    .doc,
                    .docx,
                    .xls,
                    .xlsx,
                    .ppt,
                    .pptx,
                    .txt,
                    .zip,
                    .rar,
                    .7z,
                    .csv,
                    .json,
                    .xml
                "

                onChange={handleFileChange}
            />

        </div>

    );

}

export default FileUpload;