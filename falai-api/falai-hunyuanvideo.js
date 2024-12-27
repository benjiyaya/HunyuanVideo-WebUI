import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";

dotenv.config();

const VIDEO_MODEL = 'fal-ai/hunyuan-video';

/**
 * Generate AI video based on prompt and parameters
 * @param {string} promptStr - Text description for video generation
 * @param {Object} customParams - Optional custom parameters
 * @returns {Promise<{videoUrl: string}>} Generated video information
 */

export async function falai_generateVideo(promptStr, customParams = {}) {
    try 
    {
        const result = await fal.config({
            credentials: process.env.FAL_KEY
        })
        .subscribe(VIDEO_MODEL, {
        input: {
            prompt: promptStr,
            "aspect_ratio": "16:9",
            "resolution": "720p"
        },
        logs: true,
        onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
            }
        },
        });

        console.log(result.data);
        console.log(result.requestId);
        
        //create a unique filename for the output
        const filename = result.requestId;
        const outputFilename = `faiai_${filename}_output.mp4`;
        const outputPath = `./outputs/${outputFilename}`;

        // Save the file
        await mkdir('./outputs', { recursive: true });
        await writeFile(outputPath, result.data);

        return `/outputs/${outputFilename}`;

    } catch (error) {
        console.error('Error in generateVideo:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }

}