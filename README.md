# Wildfire Risk Predictor

**Garrick Chan**, front-end development\
**Guoruizhe Sun**, back-end development, documentation\
**Jaskinder Sarai**, model design and training

## Description
This is a tool to visualize historical weather and damage information for California wildfires between 2013 and 2019. It can also make predictions of damages of future wildfires with user-provided weather information as input. We hope the ease of use of this tool is helpful for civilians and experts alike in understanding wildfire risk.

The functional parts of this repository are divided into two directories: `client` for front-end code, and `server` for back-end code. The front-end utilizes React and D3, while the backend utilizes FastAPI, MongoDB, and Scikit-Learn. Additionally, the public data we have gathered is located in `Wildfire_Historic_Data`.

**Note:** Our tool works best on 1080p resolution or higher.

## Installation
After cloning/extracting this repository, follow these steps to run the tool. We recommend using separate terminal windows for client and server processes.
We assume MongoDB Community and Node.js are installed. For Mac users, we assume Homebrew is already installed.
### Back-End
1. In one terminal window, navigate to `server`:
    ```shell
    cd server
    ```
2. If you prefer to use a clean virtual environment, set one up and run as follows:

    On Mac:
    ```shell
    python -m venv venv
    source venv/bin/activate
    ```
    On Windows:
    ```shell
    python -m venv venv
    source venv\Scripts\activate
    ```
3. Install Python packages:

    ```shell
    pip install -r requirements.txt
    ```
4. If using Windows, proceed to step 5. If using Mac, run MongoDB via Homebrew:

    ```shell
    brew services start mongodb-community
    ```
5. In MongoDB, connect to the local database:
    `mongodb://localhost:27017`
6. Import data to the local database:
    ```shell
    python import_data.py
    ```
7. Run the FastAPI server:
    ```shell
    uvicorn main:app --reload --port 8000
    ```
8. Optionally, view the API documentation in a web browser at: http://localhost:8000/docs

### Front-End
1. In another terminal window, navigate to `client`:
    ```shell
    cd client
    ```
2. Install Node.js packages:
    ```shell
    npm install
    ```
3. Start the React development server
    ```shell
    npm run dev
    ```
4. In a web browser, navigate to http://localhost:5173

## Execution
The UI has 4 main components:
- At the top, there is a dropdown menu that allows you to switch between History mode or Prediction mode.
- On the left is a Map of California counties.
- In the middle the Map is the List panel, which displays different clickable text depending on the context.
- On the right is the Compare panel, where bar charts will appear.
### View Historical Information
By default, the tool is set to History mode, and allows you to filter incidents by **Year and Month**.

Upon selecting a year and month, counties with incidents in the chosen timeframe will turn run in the Map, and the List panel to the right of the map will populate with those counties' names. Click on either a county on the Map, or a name in the List panel, to add wildfire data for that county and timeframe to the Compare panel.

Alternatively, incidents can also be filtered by **County**. Upon selecting a county, either from the dropdown menu or Map, the List panel will populate with the timeframes of all incidents for that county for which we have data. Click on a timeframe to add that incident to the Compare panel.

Up to 5 incidents can be compared at a time. To remove an incident from the Compare panel, click on the X to the right of the corresponding incident's label above the Compare panel. You may freely switch filter modes without losing selected incidents in the Compare panel. 

**Note:** The colors of the bars will always be in the same order: <span style="color:dodgerblue">1st is blue</span>, <span style="color:darkviolet">2nd is purple</span>. <span style="color:darkorange">3rd is orange</span>, <span style="color:lightseagreen">4th is teal</span>, and <span style="color:deeppink">5th is pink</span>; please keep this in mind when removing incidents and adding new ones.

### Make Predictions
To switch to Prediction mode, use the dropdown menu at the top of the page.

**Note:** When switching modes, the current state of that mode will be erased.

Part of the Compare panel will be replaced with the Input panel. Use the Input panel to enter the following information to use as input to the model:
- Number of Fires in the previous month *(default: 0)*
- Temperature, in Fahrenheit *(default: 85)*
- Precipitation, in inches *(default: 0.0)*
- Drought Index *(default: 0.0)*

Then, click **Predict**. When first entering Prediciton mode, the model will make predictions based on the default values.

To compare predictions between counties, either click on counties in the Map or click on their names in the List panel. Like in History mode, labels will appear above the Compare panel to serve as a legend, and the X on the right of each label can be used to remove the corresponding county from the comparisons. Up to 5 counties can be compared at a time. When clicking Predict while there are one or more comparisons, the comparisons will automatically update with the new predictions.