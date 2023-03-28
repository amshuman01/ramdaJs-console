import { curry, ifElse, isEmpty, pipe, tap, trim, tryCatch, when } from "ramda";

const cInput = document.querySelector(".console-input");
const historyLog = document.querySelector(".console-history");
const addResult = curry((inputAsString, output) => {
  const outputAsString =
    output instanceof Array ? `[${output.join(", ")}]` : output.toString(); // converting to string if its in array format
  const inputLogElement = document.createElement("div");
  const outputLogElement = document.createElement("div");

  inputLogElement.classList.add("console-input-log");
  outputLogElement.classList.add("console-output-log");

  inputLogElement.textContent = `> ${inputAsString}`;
  outputLogElement.textContent = outputAsString;

  historyLog.append(inputLogElement, outputLogElement);
});

const resetInput = () => {
  cInput.value = "";
  historyLog.scrollTop = historyLog.scrollHeight;
};
const code = (cInput) => trim(cInput.value);
cInput.addEventListener("keyup", (e) => {
  pipe(
    code,
    tap(console.log),
    ifElse(
      (str) => isEmpty(str),
      () => {
        console.log("error");
      },
      (str) => {
        when(
          () => e.key === "Enter",
          () => {
            tryCatch(
              () => addResult(str)(eval(str)),
              (error) => addResult(str)(error)
            )();
            resetInput();
          }
        )(str);
      }
    )
  )(cInput);
});
