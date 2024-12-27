import Replicate from 'replicate';
import dotenv from 'dotenv';
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Video generation configuration
const VIDEO_MODEL = 'tencent/hunyuan-video:847dfa8b01e739637fc76f480ede0c1d76408e1d694b830b5dfb8e547bf98405';

// Default video parameters
const DEFAULT_PARAMS = {
  width: 854,
  height: 480,
  flow_shift: 7,
  infer_steps: 20,
  video_length: 129,
  embedded_guidance_scale: 6,
};

/**
 * Generate AI video based on prompt and parameters
 * @param {string} prompt - Text description for video generation
 * @param {Object} customParams - Optional custom parameters
 * @returns {Promise<{videoUrl: string}>} Generated video information
 */
export async function rep_generateVideo(prompt, customParams = {}) {
  try {
    const input = {
      ...DEFAULT_PARAMS,
      ...customParams,
      prompt,
    };

    console.log('Input parameters:', input);

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      userAgent: 'https://www.npmjs.com/package/create-replicate'
    });

    console.log('Calling Replicate API...');

    const response = await replicate.run(
      VIDEO_MODEL, 
      { input }
    );

    //create a unique filename for the output
    const filename = uuidv4();
    const outputFilename = `replicate_${filename}_output.mp4`;
    const outputPath = `./outputs/${outputFilename}`;

    // Save the file
    await mkdir('./outputs', { recursive: true });
    await writeFile(outputPath, response);

    return `/outputs/${outputFilename}`;

  } catch (error) {
    console.error('Error in generateVideo:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

/**
 * Validate video generation parameters
 * @param {Object} params - Video parameters to validate
 * @returns {boolean} Validation result
 */
export function validateParameters(params) {
  const requiredParams = ['width', 'height', 'prompt'];
  return requiredParams.every(param => params[param] !== undefined);
} 