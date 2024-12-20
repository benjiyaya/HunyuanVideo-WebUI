# HunyuanVideo-WebUI
A Web UI simplify the AI videos generation using Hunyuan Video Diffusion Model

- This Web UI are based on Node.js, very lightweight and fast to setup and running.
- The first version-20241220 are only integrating Replicate API for Text2Video. I will at Fal.AI later in the holiday.
  
# Why I Create HunyuanVideo-WebUI?

As I mentioned in the previous post in here https://www.patreon.com/posts/117392000 , and the Youtube Video about Day 1 using HunyuanVideo (https://youtu.be/REQJYz-F1ec) . 
This AI model needs a high GPU to render good-quality and long video lengths.

So the purpose of this web UI is to streamline work and get some good-quality video clips without spending multiple times generating video results and still getting nothing good.

Of course, you can always use the ComfyUI compressed HunyuanVideo FP8 model file if you want to test this AI model or have fun only.

For video quality, a compressed model can't even get close to the original repository model weights.

# Planning upcoming update
- We are going to add more features, make it more convenient streamline for creating video content. Also improve the WebUI if need.

# Node.js Project Setup Instructions

## Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your machine (version 14 or higher recommended).
- Install [MySQL](https://www.mysql.com/) or any compatible database server.

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   Run the following command to install the required packages:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory of the project and add your API token and database configuration:
   Skip the Database setting in this version, as it have not implment in the code. That is for multi-users design.
   ```plaintext
   REPLICATE_API_TOKEN=your_api_token_here
   
   DB_HOST=localhost
   DB_USER=dbuser
   DB_PASSWORD=dbpassword
   DB_NAME=dbname
   ```

By Default Login without database use the demo account:
   ```plaintext
   login : demo
   password demo123
   ```

4. **Run the Application**
   Start the server using the following command:
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your web browser and navigate to `http://localhost:3001` (or the port specified in your environment variables).


## Troubleshooting
- If you encounter issues with the port being in use, check for running processes on that port or change the port in your environment variables.
- Review the console logs for any errors during startup or while accessing the application.

## License
This project is licensed under the MIT License.
