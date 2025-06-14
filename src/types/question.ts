
export interface FastestFingerQuestion {
  id: string;
  text: string;
  answers: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOrder: {
    one: 'a' | 'b' | 'c' | 'd';
    two: 'a' | 'b' | 'c' | 'd';
    three: 'a' | 'b' | 'c' | 'd';
    four: 'a' | 'b' | 'c' | 'd';
  };
  selected: boolean;
  difficulty: 1 | 2 | 3; // 1 = Easy, 2 = Medium, 3 = Hard
}

export interface RegularQuestion {
  id: string;
  category: string;
  text: string;
  answers: {
    a: { text: string; correct: boolean };
    b: { text: string; correct: boolean };
    c: { text: string; correct: boolean };
    d: { text: string; correct: boolean };
  };
  selected: boolean;
  difficulty: 1 | 2 | 3; // 1 = Easy, 2 = Medium, 3 = Hard
}
