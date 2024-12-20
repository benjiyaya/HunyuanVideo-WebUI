# HunyuanVideo-WebUI
A Web UI simplify the AI videos generation using Hunyuan Video Diffusion Model

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
