import React, { useCallback, useEffect, useRef, useState } from "react";
import logo1 from "./img/NCB1.png";
import logo2 from "./img/Teller.png";
import Crossword, {
  CrosswordImperative,
  CrosswordGrid,
  CrosswordProps,
  CrosswordProvider,
  CrosswordProviderImperative,
  CrosswordProviderProps,
  DirectionClues,
  useIpuz,
} from "@jaredreisinger/react-crossword";
import styled from "styled-components";
import "./App.css";
// const data = {
//   across: {
//     1: {
//       clue: 'one plus one',
//       answer: 'TWO',
//       row: 0,
//       col: 0,
//     },
//   },
//   down: {
//     2: {
//       clue: 'three minus two',
//       answer: 'ONE',
//       row: 0,
//       col: 2,
//     },
//   },
// };
// BƯỚC 1: DỮ LIỆU ĐƯA VÀO ĐÂY
const data = {
  //HÀNG NGANG
  across: {
    1: {
      clue: "one plus one",
      answer: "XÔNGĐẤT",
      row: 0,
      col: 5,
    },
    2: {
      clue: "capital of France",
      answer: "GIAOTHỪA",
      row: 1,
      col: 7,
    },
    3: {
      clue: "popular programming language",
      answer: "ĐÁNHĐU",
      row: 2,
      col: 2,
    },
    4: {
      clue: "popular programming language",
      answer: "CÂYNÊU",
      row: 3,
      col: 5,
    },
    5: {
      clue: "popular programming language",
      answer: "TẤTNIÊN",
      row: 4,
      col: 2,
    },
    6: {
      clue: "popular programming language",
      answer: "NGÃBASÔNG",
      row: 5,
      col: 0,
    },
    7: {
      clue: "popular programming language",
      answer: "CÂUĐỐI",
      row: 6,
      col: 4,
    },
    8: {
      clue: "popular programming language",
      answer: "HÁTXOAN",
      row: 7,
      col: 6,
    },
    9: {
      clue: "popular programming language",
      answer: "BÁNHCHƯNG",
      row: 8,
      col: 5,
    },
    // Add more across clues as needed
  },
  down: {
    // HÀNG DỌC
    10: {
      clue: "popular programming language",
      answer: "NGUYÊNĐÁN",
      row: 0,
      col: 7,
    },
    // Add more down clues as needed
  },
};

const Page = styled.div`
  padding: 2em;
  gridbackground: rgb(255, 0, 0);
`;

const Header = styled.h1`
  margin-bottom: 1em;
`;

const Commands = styled.div``;

const Command = styled.button`
  margin-right: 1em;
`;

const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;

  gap: 2em;
`;

const CrosswordWrapper = styled.div`
  max-width: 30em;

  /* and some fun making use of the defined class names */
  .crossword.correct {
    rect {
      stroke: rgb(100, 200, 100) !important;
    }
    svg > rect {
      fill: rgb(100, 200, 100) !important;
    }
    text {
      fill: rgb(100, 200, 100) !important;
    }
  }
  .clue {
    background-color: rgb(255, 99, 71);
  }
  .direction {
    display: none;
  }
  .clue.correct {
    ::before {
      content: "\u2713"; /* a.k.a. checkmark: ✓ */
      display: inline-block;
      text-decoration: none;
      color: rgb(255, 99, 71);

      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(255, 99, 71);
  }
`;

const CrosswordProviderWrapper = styled(CrosswordWrapper)`
  max-width: 80em;
  display: flex;
  gap: 1em;

  z-index: -1;

  .grid {
    width: 60em;

    padding-top: 6rem;
  }
`;

// in order to make this a more-comprehensive example, and to vet Crossword's
// features, we actually implement a fair amount...

function App() {
  const [selectedRow, setSelectedRow] = useState(null);

  const crossword = useRef<CrosswordImperative>(null);

  const focus = useCallback<React.MouseEventHandler>((event) => {
    crossword.current?.focus();
  }, []);

  const fillOneCell = useCallback<React.MouseEventHandler>((event) => {
    crossword.current?.setGuess(0, 2, "O");
  }, []);

  const fillAllAnswers = useCallback<React.MouseEventHandler>((event) => {
    crossword.current?.fillAllAnswers();
  }, []);

  const reset = useCallback<React.MouseEventHandler>((event) => {
    crossword.current?.reset();
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesRef = useRef<HTMLPreElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const clearMessages = useCallback<React.MouseEventHandler>((event) => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: string) => {
    setMessages((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    const { scrollHeight } = messagesRef.current;
    messagesRef.current.scrollTo(0, scrollHeight);
  }, [messages]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrect = useCallback<Required<CrosswordProps>["onCorrect"]>(
    (direction, number, answer) => {
      addMessage(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessage],
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrect = useCallback<
    Required<CrosswordProps>["onLoadedCorrect"]
  >(
    (answers) => {
      addMessage(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`,
          )
          .join("\n")}`,
      );
    },
    [addMessage],
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrect = useCallback<
    Required<CrosswordProps>["onCrosswordCorrect"]
  >(
    (isCorrect) => {
      addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessage],
  );

  // Update your existing revealRowAnswer function

  // onCellChange is called with the row, column, and character.
  const onCellChange = useCallback<Required<CrosswordProps>["onCellChange"]>(
    (row, col, char) => {
      addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessage],
  );

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  // BƯỚC 2: ĐIỀN CÂU LỆNH RA ĐÁP ÁN TỪNG DÒNG (SỐ CỦA HÀNG DỌC,SỐ CỦA HÀNG NGANG, TỪ ĐIỀN VÀO)
  const fillAnswer1 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(0, 5, "X");
    crosswordProvider.current?.setGuess(0, 6, "Ô");
    crosswordProvider.current?.setGuess(0, 7, "N");
    crosswordProvider.current?.setGuess(0, 8, "g");
    crosswordProvider.current?.setGuess(0, 9, "Đ");
    crosswordProvider.current?.setGuess(0, 10, "Ấ");
    crosswordProvider.current?.setGuess(0, 11, "T");
  }, []);

  const fillAnswer2 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(1, 7, "g");
    crosswordProvider.current?.setGuess(1, 8, "i");
    crosswordProvider.current?.setGuess(1, 9, "a");
    crosswordProvider.current?.setGuess(1, 10, "o");
    crosswordProvider.current?.setGuess(1, 11, "t");
    crosswordProvider.current?.setGuess(1, 12, "h");
    crosswordProvider.current?.setGuess(1, 13, "ừ");
    crosswordProvider.current?.setGuess(1, 14, "a");
  }, []);
  const fillAnswer3 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(2, 2, "đ");
    crosswordProvider.current?.setGuess(2, 3, "á");
    crosswordProvider.current?.setGuess(2, 4, "n");
    crosswordProvider.current?.setGuess(2, 5, "h");
    crosswordProvider.current?.setGuess(2, 6, "đ");
    crosswordProvider.current?.setGuess(2, 7, "u");
  }, []);
  const fillAnswer4 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(3, 5, "c");
    crosswordProvider.current?.setGuess(3, 6, "â");
    crosswordProvider.current?.setGuess(3, 7, "y");
    crosswordProvider.current?.setGuess(3, 8, "n");
    crosswordProvider.current?.setGuess(3, 9, "ê");
    crosswordProvider.current?.setGuess(3, 10, "u");
  }, []);

  const fillAnswer5 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(4, 2, "T");
    crosswordProvider.current?.setGuess(4, 3, "Ấ");
    crosswordProvider.current?.setGuess(4, 4, "T");
    crosswordProvider.current?.setGuess(4, 5, "N");
    crosswordProvider.current?.setGuess(4, 6, "I");
    crosswordProvider.current?.setGuess(4, 7, "Ê");
    crosswordProvider.current?.setGuess(4, 8, "N");
  }, []);

  const fillAnswer6 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(5, 0, "N");
    crosswordProvider.current?.setGuess(5, 1, "G");
    crosswordProvider.current?.setGuess(5, 2, "Ã");
    crosswordProvider.current?.setGuess(5, 3, "B");
    crosswordProvider.current?.setGuess(5, 4, "A");
    crosswordProvider.current?.setGuess(5, 5, "S");
    crosswordProvider.current?.setGuess(5, 6, "Ô");
    crosswordProvider.current?.setGuess(5, 7, "N");
    crosswordProvider.current?.setGuess(5, 8, "G");
  }, []);
  const fillAnswer7 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(6, 4, "C");
    crosswordProvider.current?.setGuess(6, 5, "Â");
    crosswordProvider.current?.setGuess(6, 6, "U");
    crosswordProvider.current?.setGuess(6, 7, "Đ");
    crosswordProvider.current?.setGuess(6, 8, "Ố");
    crosswordProvider.current?.setGuess(6, 9, "I");
  }, []);

  const fillAnswer8 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(7, 6, "H");
    crosswordProvider.current?.setGuess(7, 7, "Á");
    crosswordProvider.current?.setGuess(7, 8, "T");
    crosswordProvider.current?.setGuess(7, 9, "X");
    crosswordProvider.current?.setGuess(7, 10, "O");
    crosswordProvider.current?.setGuess(7, 11, "A");
    crosswordProvider.current?.setGuess(7, 12, "N");
  }, []);

  const fillAnswer9 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(8, 5, "B");
    crosswordProvider.current?.setGuess(8, 6, "Á");
    crosswordProvider.current?.setGuess(8, 7, "N");
    crosswordProvider.current?.setGuess(8, 8, "H");
    crosswordProvider.current?.setGuess(8, 9, "C");
    crosswordProvider.current?.setGuess(8, 10, "H");
    crosswordProvider.current?.setGuess(8, 11, "Ư");
    crosswordProvider.current?.setGuess(8, 12, "N");
    crosswordProvider.current?.setGuess(8, 13, "N");
  }, []);

  const fillAnswer10 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(0, 7, "N");
    crosswordProvider.current?.setGuess(1, 7, "G");
    crosswordProvider.current?.setGuess(2, 7, "U");
    crosswordProvider.current?.setGuess(3, 7, "Y");
    crosswordProvider.current?.setGuess(4, 7, "Ê");
    crosswordProvider.current?.setGuess(5, 7, "N");
    crosswordProvider.current?.setGuess(6, 7, "Đ");
    crosswordProvider.current?.setGuess(7, 7, "Á");
    crosswordProvider.current?.setGuess(8, 7, "N");
  }, []);

  const fillAllAnswersProvider = useCallback<React.MouseEventHandler>(
    (event) => {
      crosswordProvider.current?.fillAllAnswers();
    },
    [],
  );

  const resetProvider = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.reset();
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesProviderRef = useRef<HTMLPreElement>(null);
  const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

  const clearMessagesProvider = useCallback<React.MouseEventHandler>(
    (event) => {
      setMessagesProvider([]);
    },
    [],
  );

  const addMessageProvider = useCallback((message: string) => {
    setMessagesProvider((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesProviderRef.current) {
      return;
    }
    const { scrollHeight } = messagesProviderRef.current;
    messagesProviderRef.current.scrollTo(0, scrollHeight);
  }, [messagesProvider]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrectProvider = useCallback<
    Required<CrosswordProviderProps>["onCorrect"]
  >(
    (direction, number, answer) => {
      addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessageProvider],
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrectProvider = useCallback<
    Required<CrosswordProviderProps>["onLoadedCorrect"]
  >(
    (answers) => {
      addMessageProvider(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`,
          )
          .join("\n")}`,
      );
    },
    [addMessageProvider],
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrectProvider = useCallback<
    Required<CrosswordProviderProps>["onCrosswordCorrect"]
  >(
    (isCorrect) => {
      addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessageProvider],
  );

  // onCellChange is called with the row, column, and character.
  const onCellChangeProvider = useCallback<
    Required<CrosswordProviderProps>["onCellChange"]
  >(
    (row, col, char) => {
      addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessageProvider],
  );
  // BƯỚC 3: ĐIỀN CÂU LỆNH VỪA NHẬP Ở BƯỚC 2 VÀO:
  // <Command onClick={CÂU LỆNH }>Hiện đáp án </Command>
  // VÍ DỤ <Command onClick={fillAnswer10}>Hiện đáp án 10</Command>
  return (
    <div className="page">
      <Page>
        <Header className="headerPage">PHẦN THI VƯỢT QUA THỬ THÁCH</Header>

        <CrosswordMessageBlock>
          <Commands>
            <Command onClick={fillAnswer1}>Hiện đáp án 1</Command>
            <Command onClick={fillAnswer2}>Hiện đáp án 2</Command>
            <Command onClick={fillAnswer3}>Hiện đáp án 3</Command>
            <Command onClick={fillAnswer4}>Hiện đáp án 4</Command>
            <Command onClick={fillAnswer5}>Hiện đáp án 5</Command>
            <Command onClick={fillAnswer6}>Hiện đáp án 6</Command>
            <Command onClick={fillAnswer7}>Hiện đáp án 7</Command>
            <Command onClick={fillAnswer8}>Hiện đáp án 8</Command>
            <Command onClick={fillAnswer9}>Hiện đáp án 9</Command>
            <Command onClick={fillAnswer10}>Hiện đáp án 10</Command>
            <Command onClick={fillAllAnswersProvider}>
              Điền toàn bộ câu trả lời
            </Command>
            <Command onClick={resetProvider}>Reset</Command>
          </Commands>

          <CrosswordProviderWrapper>
            <CrosswordProvider
              ref={crosswordProvider}
              data={data}
              theme={{
                gridBackground: "rgba(255, 255, 255, .0)",
                cellBackground: "rgb(0, 83, 236)",
                cellBorder: "#441151",
                textColor: "rgb(255,255,255)",
                numberColor: "rgb(255,255,255)",
                focusBackground: "rgb(227, 17, 49)",
                highlightBackground: "rgb(227, 17, 49)",
              }}
              storageKey="second-example"
              onCorrect={onCorrectProvider}
              onLoadedCorrect={onLoadedCorrectProvider}
              onCrosswordCorrect={onCrosswordCorrectProvider}
              onCellChange={onCellChangeProvider}
            >
              <CrosswordGrid />
            </CrosswordProvider>
          </CrosswordProviderWrapper>
        </CrosswordMessageBlock>
      </Page>
    </div>
  );
}

export default App;
