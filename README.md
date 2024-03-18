# Your Past Companion

## About

The objective of this project was to develop a chatbot catered to museums, which present the user with short and informative facts about historical events or figures, which could act as a substitute for tour guides during the COVID-19 pandemic. 

## Local Configuration


**Install Anaconda**

Download from: https://www.anaconda.com


**NOTE:** Check out this video https://www.youtube.com/watch?v=gvVf-ouIla4 for complete installation instructions once Anaconda is installed on your desktop. 


**Intall Pytorch with Mac**
```bash
conda install pytorch torchvision torchaudio -c pytorch
```
**Intall Pytorch with Windows**
```bash
conda install pytorch torchvision torchaudio cpuonly -c pytorch
```

**Clone the Repository**

Clone the repo, then create a virtual environment in either your desktop or downloads directory. 
Please follow instructions below:

```bash
git clone https://github.com/whdesigns/YourPastCompanion.git
```

```bash
cd YourPastCompanion
```

```bash
python3 -m venv venv
```

```bash
. venv/bin/activate
```

**Install Dependencies**
```bash
pip install Flask torch torchvision nltk
```

**Install nltk package in Terminal**
```bash
python
```

```bash
import nltk
```

```bash
nltk.download('punkt')
```
**NOTE:** If you are having trouble with this part. See this video https://www.youtube.com/watch?v=gvVf-ouIla4 for complete instructions on how to install and run the chatbot.  


**Run application**
Open VS Code, along with the cloned repo. Then run the app.py file. 

```bash
app.py
```

**Test the following questions with the chatbot to see if they work:**

find mona lisa

where is the mona lisa

When was the Louvre built?

How big is the Louvre?

Louvre size?

covid rules

covid
