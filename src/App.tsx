import React, { useCallback, useEffect,ReactNode, useRef, useState } from "react";
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
const data = {
  //HÀNG NGANG
  across: {
    1: {
      clue: "one plus one",
      answer: "TACPHONG",
      row: 0,
      col: 5,
    },
    2: {
      clue: "one plus one",
      answer: "ANPHAT",
      row: 1,
      col: 4,
    },
    3: {
      clue: "one plus one",
      answer: "LAMCHUCONGNGHE",
      row: 2,
      col: 2,
    },
    4: {
      clue: "one plus one",
      answer: "QUANLY",
      row: 3,
      col: 2,
    },
    5: {
      clue: "one plus one",
      answer: "BAOVETAISAN",
      row: 4,
      col: 3,
    },
    6: {
      clue: "one plus one",
      answer: "CONSO",
      row: 5,
      col: 5,
    },
    7: {
      clue: "one plus one",
      answer: "HATXAM",
      row: 6,
      col: 2,
    },
    8: {
      clue: "one plus one",
      answer: "KIEMSOAT",
      row: 7,
      col: 6,
    },
    9: {
      clue: "one plus one",
      answer: "BANHCHUNG",
      row: 8,
      col: 5,
    },
    10: {
      clue: "one plus one",
      answer: "CHUYENKHOAN",
      row: 9,
      col: 0,
    },
    
    // Add more across clues as needed
  },
  down: {
    11: {
      clue: "one plus one",
      answer: "CHUYENMINH",
      row: 0,
      col: 7,
    },

    // HÀNG DỌC

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

const Commands = styled.div`
  padding-top: 5rem;
`;

const Command = styled.button`
  margin-right: 1em;
  display: flex;
  padding: 1em;
`;

const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;
  display: flex;
  gap: 30em;
  padding-top: 10rem;
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

  .grid {
    width: 60em;

    padding-top: 5rem;
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
    [addMessage]
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
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join("\n")}`
      );
    },
    [addMessage]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrect = useCallback<
    Required<CrosswordProps>["onCrosswordCorrect"]
  >(
    (isCorrect) => {
      addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessage]
  );

  // Update your existing revealRowAnswer function

  // onCellChange is called with the row, column, and character.
  const onCellChange = useCallback<Required<CrosswordProps>["onCellChange"]>(
    (row, col, char) => {
      addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessage]
  );

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);
  const fillAnswer1 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(0, 5, "T");
    crosswordProvider.current?.setGuess(0, 6, "A");
    crosswordProvider.current?.setGuess(0, 7, "C");
    crosswordProvider.current?.setGuess(0, 8, "P");
    crosswordProvider.current?.setGuess(0, 9, "H");
    crosswordProvider.current?.setGuess(0, 10, "O");
    crosswordProvider.current?.setGuess(0, 11, "N");
    crosswordProvider.current?.setGuess(0, 12, "G");
   
  }, []);

  const fillAnswer2 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(1, 4, "A");
    crosswordProvider.current?.setGuess(1, 5, "N");
    crosswordProvider.current?.setGuess(1, 6, "P");
    crosswordProvider.current?.setGuess(1, 7, "H");
    crosswordProvider.current?.setGuess(1, 8, "A");
    crosswordProvider.current?.setGuess(1, 9, "T");
  }, []);
  const fillAnswer3 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(2, 2, "L");
    crosswordProvider.current?.setGuess(2, 3, "A");
    crosswordProvider.current?.setGuess(2, 4, "M");
    crosswordProvider.current?.setGuess(2, 5, "C");
    crosswordProvider.current?.setGuess(2, 6, "H");
    crosswordProvider.current?.setGuess(2, 7, "U");
    crosswordProvider.current?.setGuess(2, 8, "C");
    crosswordProvider.current?.setGuess(2, 9, "O");
    crosswordProvider.current?.setGuess(2, 10, "N");
    crosswordProvider.current?.setGuess(2, 11, "G");
    crosswordProvider.current?.setGuess(2, 12, "N");
    crosswordProvider.current?.setGuess(2, 13, "G");
    crosswordProvider.current?.setGuess(2, 14, "H");
    crosswordProvider.current?.setGuess(2, 15, "E");
   
    
  }, []);
  const fillAnswer4 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(3, 2, "Q");
    crosswordProvider.current?.setGuess(3, 3, "U");
    crosswordProvider.current?.setGuess(3, 4, "A");
    crosswordProvider.current?.setGuess(3, 5, "N");
    crosswordProvider.current?.setGuess(3, 6, "L");
    crosswordProvider.current?.setGuess(3, 7, "Y");
  
  
  }, []);

  const fillAnswer5 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(4, 3, "B");
    crosswordProvider.current?.setGuess(4, 4, "A");
    crosswordProvider.current?.setGuess(4, 5, "O");
    crosswordProvider.current?.setGuess(4, 6, "V");
    crosswordProvider.current?.setGuess(4, 7, "E");
    crosswordProvider.current?.setGuess(4, 8, "T");
    crosswordProvider.current?.setGuess(4, 9, "A");
    crosswordProvider.current?.setGuess(4, 10, "I");
    crosswordProvider.current?.setGuess(4, 11, "S");
    crosswordProvider.current?.setGuess(4, 12, "A");
    crosswordProvider.current?.setGuess(4, 13, "N");
    
  }, []);

  const fillAnswer6 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(5, 5, "C");
    crosswordProvider.current?.setGuess(5, 6, "O");
    crosswordProvider.current?.setGuess(5, 7, "N");
    crosswordProvider.current?.setGuess(5, 8, "S");
    crosswordProvider.current?.setGuess(5, 9, "O");
   
  }, []);
  const fillAnswer7 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(6, 2, "H");
    crosswordProvider.current?.setGuess(6, 3, "A");
    crosswordProvider.current?.setGuess(6, 4, "T");
    crosswordProvider.current?.setGuess(6, 5, "X");
    crosswordProvider.current?.setGuess(6, 6, "A");
    crosswordProvider.current?.setGuess(6, 7, "M");
  
  }, []);

  const fillAnswer8 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(7, 6, "K");
    crosswordProvider.current?.setGuess(7, 7, "I");
    crosswordProvider.current?.setGuess(7, 8, "E");
    crosswordProvider.current?.setGuess(7, 9, "M");
    crosswordProvider.current?.setGuess(7, 10, "S");
    crosswordProvider.current?.setGuess(7, 11, "O");
    crosswordProvider.current?.setGuess(7, 12, "A");
    crosswordProvider.current?.setGuess(7, 13, "T");
   
   
   
  }, []);

  const fillAnswer9 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(8, 5, "B");
    crosswordProvider.current?.setGuess(8, 6, "A");
    crosswordProvider.current?.setGuess(8, 7, "N");
    crosswordProvider.current?.setGuess(8, 8, "H");
    crosswordProvider.current?.setGuess(8, 9, "C");
    crosswordProvider.current?.setGuess(8, 10, "H");
    crosswordProvider.current?.setGuess(8, 11, "U");
    crosswordProvider.current?.setGuess(8, 12, "N");
    crosswordProvider.current?.setGuess(8, 13, "G");
    
  }, []);

  const fillAnswer10 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(9, 0, "C");
    crosswordProvider.current?.setGuess(9, 1, "H");
    crosswordProvider.current?.setGuess(9, 2, "U");
    crosswordProvider.current?.setGuess(9, 3, "Y");
    crosswordProvider.current?.setGuess(9, 4, "E");
    crosswordProvider.current?.setGuess(9, 5, "N");
    crosswordProvider.current?.setGuess(9, 6, "K");
    crosswordProvider.current?.setGuess(9, 7, "H");
    crosswordProvider.current?.setGuess(9, 8, "O");
    crosswordProvider.current?.setGuess(9, 9, "A");
    crosswordProvider.current?.setGuess(9, 10, "N");
  }, []);
  const fillAnswer11 = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(0, 7, "C");
    crosswordProvider.current?.setGuess(1, 7, "H");
    crosswordProvider.current?.setGuess(2, 7, "U");
    crosswordProvider.current?.setGuess(3, 7, "Y");
    crosswordProvider.current?.setGuess(4, 7, "E");
    crosswordProvider.current?.setGuess(5, 7, "N");
    crosswordProvider.current?.setGuess(6, 7, "M");
    crosswordProvider.current?.setGuess(7, 7, "I");
    crosswordProvider.current?.setGuess(8, 7, "N");
    crosswordProvider.current?.setGuess(9, 7, "H");
  
  }, []);
  const fillAllAnswersProvider = useCallback<React.MouseEventHandler>(
    (event) => {
      crosswordProvider.current?.fillAllAnswers();
    },
    []
  );
  type ToggleTextButtonProps = {
    children: ReactNode;
  };
  
  // The ToggleTextButton component with TypeScript
  const ToggleTextButton: React.FC<ToggleTextButtonProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };
  
    return (
      <div>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Ẩn Câu Hỏi' : 'Hiện Câu Hỏi'}
        </button>
        {isVisible && <div>{children}</div>}
      </div>
    );
  };
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
    []
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
    [addMessageProvider]
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
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join("\n")}`
      );
    },
    [addMessageProvider]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrectProvider = useCallback<
    Required<CrosswordProviderProps>["onCrosswordCorrect"]
  >(
    (isCorrect) => {
      addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessageProvider]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChangeProvider = useCallback<
    Required<CrosswordProviderProps>["onCellChange"]
  >(
    (row, col, char) => {
      addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessageProvider]
  );

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
            <Command onClick={fillAnswer11}>Đáp án ô chữ bí ẩn</Command>
            

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
          <div className="question">
            <h1>Câu Hỏi</h1>
            <ol>
              <li><ToggleTextButton>Không làm việc riêng khi có Khách hàng là thể hiện tiêu chí nào trong bộ tiêu chuẩn CLDV?</ToggleTextButton></li> 
              <li><ToggleTextButton>Tên sản phẩm tiền gửi tiết kiệm trong đó khách hàng có cam kết về thời gian gửi tiền?</ToggleTextButton></li>
              <li><ToggleTextButton>Đây là tên Năng lực cốt lõi thứ 3?</ToggleTextButton></li>
              <li><ToggleTextButton>Điền từ vào dấu … để hoàn thiện tên một trong 05 năng lực lãnh đạo: "… sự thay đổi"?</ToggleTextButton></li>
              <li><ToggleTextButton>Tên Điều 26 trong NQLĐ trong đó có quy định: Người lao động có trách nhiệm bảo vệ phương tiện làm việc và các tài sản khác của NCB trong suốt quá trình làm việc tại NCB?</ToggleTextButton></li>
              <li><ToggleTextButton>Theo cách gọi của người Việt Nam, nhà hát Opera còn có tên gọi khác là gì?</ToggleTextButton></li>
              <li><ToggleTextButton>Tên loại hình nghệ thuật khi nhắc đến nghệ nhân Hà Thị Cầu?</ToggleTextButton></li>
              <li><ToggleTextButton>Một khâu quan trọng giúp hạn chế sai lỗi phát sinh trong giao dịch?</ToggleTextButton></li>
              <li><ToggleTextButton>Cái gì trong trắng ngoài xanh, trồng đậu trồng hành rồi thả heo vào?</ToggleTextButton></li>
              <li><ToggleTextButton>Một hình thức thanh toán không dùng tiền mặt?</ToggleTextButton></li>
              
             
            </ol>
            <h3> </h3> 
            <h3></h3>
          </div>
        </CrosswordMessageBlock>
      </Page>
    </div>
  );
}

export default App;
