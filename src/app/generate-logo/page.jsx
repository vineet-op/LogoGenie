'use client';

import React, { useEffect, useState } from 'react';
import Prompt from "../create/_data/Prompt";
import axios from 'axios';

const GenerateLogo = () => {
    const [storageData, setStorageData] = useState(null);
    const [base64Image, setBase64Image] = useState()
    const [loading, setloading] = useState(false)

    useEffect(() => {
        // Retrieve the stored data from localStorage
        try {
            const data = localStorage.getItem("formData");
            if (data) {
                setStorageData(JSON.parse(data));
            } else {
                console.warn("No data found in localStorage.");
            }
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    }, []);

    useEffect(() => {
        if (storageData) {
            LogoMaker();
        }
    }, [storageData]);

    const LogoMaker = async () => {
        if (!storageData) return;

        const PROMPT = Prompt.LOGO_PROMPT
            .replace('{logoTitle}', storageData?.title || "")
            .replace('{logoDesc}', storageData?.info || "")
            .replace('{logoColor}', storageData?.color || "")
            .replace('{logoIdea}', storageData?.design?.title || "")
            .replace('{logoDesign}', storageData?.idea || "")
            .replace('{logoPrompt}', storageData?.design?.prompt || "");

        // console.log("Real Prompt", PROMPT);

        try {
            setloading(true)
            const PromptResponse = await axios.post('/api/ai-logo-model', {
                prompt: PROMPT
            })
            setBase64Image(PromptResponse.data.image)
            setloading(false)
        }
        catch (error) {
            console.error("Error fetching the image:", error);
        }


    };

    return (
        <div>
            <h1>Logo Generator</h1>
            {
                loading ? (
                    <div className='text-3xl'>Loading ... </div>
                ) : (
                    <div>
                        <img src={base64Image} alt={"Logo Image"} />
                    </div>
                )
            }
        </div>
    );
};

export default GenerateLogo;
