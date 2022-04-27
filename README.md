# Your Past Companion

William Hughes | Q14147939

## About

The objective of this project was to develop a chatbot catered to museums, which present the user with short and informative facts about historical events or figures, which could work as a substitute for tour guides during the COVID pandemic. 

## Local Configuration

**Install Anaconda**
```bash
Download from https://www.anaconda.com
```

**Intall Pytorch with Mac**
```bash
conda install pytorch torchvision torchaudio -c pytorch
```
**Intall Pytorch with Windows**
```bash
conda install pytorch torchvision torchaudio cpuonly -c pytorch
```

**Clone the Repository**

Clone the repo, then create a virtual environment. 

```bash
git clone https://github.com/WillHughesGithub/YourPastCompanion.git
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

**Run application**
```bash
python app.py
```
