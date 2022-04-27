class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
      backButton: document.querySelector(".chatbox__back-button"),

      // prettier-ignore
      languagePrevButton: document.querySelector(".chatbox__language--prev-btn"),
      // prettier-ignore
      languageNextButton: document.querySelector(".chatbox__language--next-btn"),
    };
    this.state = false;
    this.messages = [];
    this.slideIndex = 1;
    this.languages = [
      { flagName: "gbr", code: "en", text: "English" },
      { flagName: "fr", code: "fr", text: "French" },
      { flagName: "de", code: "de", text: "German" },
      { flagName: "it", code: "it", text: "Italian" },
    ];
    this.languageStorageKey = "langSelected";
  }

  display() {
    const {
      openButton,
      chatBox,
      sendButton,
      languagePrevButton,
      languageNextButton,
      backButton,
    } = this.args;

    this.languageInit(chatBox);

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    if (this.getLanguageFromLocalStorage()) {
      this.displayChatBoxMessage(chatBox, true);
    }
    backButton.addEventListener("click", () =>
      this.displayChatBoxMessage(chatBox, false)
    );

    languagePrevButton.addEventListener("click", () => this.changeSlides(-1));

    chatBox
      .querySelector(".chatbox__languages")
      .addEventListener("click", (event) => {
        if (!event.target.closest(".chatbox__start-conversation-btn")) return;

        if (
          this.getLanguageFromLocalStorage() !== event.target.dataset.language
        ) {
          this.chatmessage.innerHTML = "";
          this.messages = [];
        }

        this.setLanguageToLocalStorage(event.target.dataset.language);

        this.displayChatBoxMessage(chatBox, true);
      });

    languageNextButton.addEventListener("click", () => this.changeSlides(1));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key == "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  addLanguage(language, chatBox) {
    let html = `
    <div class="chatbox__language fade">
      <img class="chatbox__language--flag" src="/static/images/${language.flagName}.png" />
      <div class="chatbox__language--text">${language.text}</div>
      <button class="chatbox__start-conversation-btn" data-language="${language.code}">
        ${language.buttonText}
      </button>
    </div>`;

    chatBox
      .querySelector(".chatbox__languages")
      .insertAdjacentHTML("beforeend", html);
  }

  chatmessage = document.querySelector(".chatbox__messages");

  chatboxDescriptionHeader = document.querySelector(
    ".chatbox__description--header"
  );
  clonedChatboxDescriptionHeader =
    this.chatboxDescriptionHeader.cloneNode(true);

  chatboxHeadingHeader = document.querySelector(".chatbox__heading--header");
  clonedChatboxHeadingHeader = this.chatboxHeadingHeader.cloneNode(true);

  sendMessageButton = document.querySelector(".send__button");
  clonedSendMessageButton = this.sendMessageButton.cloneNode(true);

  inputMessageBox = document.querySelector(".chatbox__input");
  clonedInputMessageBox = this.inputMessageBox.cloneNode(true);

  displayChatBoxMessage(chatBox, shouldShow) {
    let translateInputMessageBoxText = this.translateText(
      this.clonedInputMessageBox.placeholder,
      this.getLanguageFromLocalStorage()
    );

    let translateSendMessageButtonText = this.translateText(
      this.clonedSendMessageButton.textContent,
      this.getLanguageFromLocalStorage()
    );

    let translateChatBoxHeaderText = this.translateText(
      this.clonedChatboxHeadingHeader.textContent,
      this.getLanguageFromLocalStorage()
    );

    let translateChatBoxHeadingDescriptionText = this.translateText(
      this.clonedChatboxDescriptionHeader.textContent,
      this.getLanguageFromLocalStorage()
    );

    (async () => {
      const [
        translatedChatBoxHeaderText,
        translatedChatBoxHeadingDescriptionText,
        translatedSendMessageButtonText,
        translatedInputMessageBoxText,
      ] = await Promise.all([
        translateChatBoxHeaderText,
        translateChatBoxHeadingDescriptionText,
        translateSendMessageButtonText,
        translateInputMessageBoxText,
      ]);

      this.chatboxHeadingHeader.textContent = translatedChatBoxHeaderText;
      this.chatboxDescriptionHeader.textContent =
        translatedChatBoxHeadingDescriptionText;

      this.sendMessageButton.textContent = translatedSendMessageButtonText;
      this.inputMessageBox.placeholder = translatedInputMessageBoxText;

      if (shouldShow) {
        chatBox
          .querySelector(".chatbox__messages--container")
          .classList.remove("hide");
        chatBox.querySelector(".chatbox__languages").classList.add("hide");
        chatBox.querySelector(".chatbox__back-button").classList.remove("hide");
      } else {
        chatBox
          .querySelector(".chatbox__messages--container")
          .classList.add("hide");
        chatBox.querySelector(".chatbox__languages").classList.remove("hide");
        chatBox.querySelector(".chatbox__back-button").classList.add("hide");
      }
    })();
  }

  languageInit(chatBox) {
    this.slideIndex = 1;

    this.languages = this.languages.map((language) => ({
      ...language,
      buttonText: "Let's Talk",
    }));

    this.languages.forEach((language) => {
      let translateLanguageText = this.translateText(
        language.text,
        language.code
      );

      let translateButtonText = this.translateText(
        language.buttonText,
        language.code
      );

      (async () => {
        const [translatedButtonText, translatedLanguageText] =
          await Promise.all([translateButtonText, translateLanguageText]);
        language.text = translatedLanguageText;
        language.buttonText = translatedButtonText;
        this.addLanguage(language, chatBox);
        this.showSlides(chatBox.getElementsByClassName("chatbox__language"));
      })();
    });
  }

  showSlides(slides, number = 1) {
    let i;
    let currentSlide = "";
    if (number > slides.length) {
      this.slideIndex = 1;
    }
    if (number < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].classList.add("hide");
    }

    currentSlide = slides[this.slideIndex - 1];

    currentSlide.classList.remove("hide");
  }

  // Next/previous controls
  changeSlides(number) {
    this.showSlides(
      document.getElementsByClassName("chatbox__language"),
      (this.slideIndex += number)
    );
  }

  currentSlide(number) {
    showSlides((slideIndex = number));
  }

  setLanguageToLocalStorage(language) {
    localStorage.setItem(this.languageStorageKey, language);
  }

  getLanguageFromLocalStorage() {
    return localStorage.getItem(this.languageStorageKey);
  }

  toggleState(chatbox) {
    this.state = !this.state;

    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  async translateText(textToTranslate, language) {
    let lowercaseLanguage = language.toLowerCase();
    return await translate(textToTranslate, {
      from: language,
      to: "en",
    }).then((textTranslatedToEnglish) => {
      return translate(textTranslatedToEnglish, lowercaseLanguage);
    });
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let sendersMessage = textField.value;
    if (textField.value == "") {
      return;
    }

    let sender = { name: "User", message: sendersMessage };
    this.messages.push(sender);

    const fetchMessages = async () => {
      const getMessage = await fetch($SCRIPT_ROOT + "/predict", {
        method: "POST",
        body: JSON.stringify({ message: sendersMessage }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      try {
        const chatmessages = await getMessage.json();
        this.translateText(
          chatmessages.answer,
          this.getLanguageFromLocalStorage()
        ).then((message) => {
          if (message) {
            textField.disabled = false;

            let receiversMessage = {
              name: "Will",
              message: message,
            };

            this.messages.push(receiversMessage);
            this.updateChatText(chatbox);
            textField.value = "";
          } else {
            textField.disabled = true;
          }
        });
      } catch (error) {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      }
    };

    fetchMessages();
    this.updateChatText(chatbox);
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Will") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    this.chatmessage.innerHTML = html;
  }
}

const chatbox = new Chatbox();
chatbox.display();
