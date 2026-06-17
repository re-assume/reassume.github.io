import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { ResumeData, ActivePanel } from '../types/resume';
import { createEmptyResume, sampleResume } from '../data/sampleResume';
import { v4 as uuid } from 'uuid';

interface AppState {
  resume: ResumeData;
  resumes: ResumeData[];
  activePanel: ActivePanel;
  jobDescription: string;
  isDark: boolean;
  zoom: number;
}

type Action =
  | { type: 'SET_RESUME'; payload: ResumeData }
  | { type: 'UPDATE_RESUME'; payload: Partial<ResumeData> }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'SET_PANEL'; payload: ActivePanel }
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'NEW_RESUME' }
  | { type: 'LOAD_SAMPLE' }
  | { type: 'CLONE_RESUME' }
  | { type: 'ADD_RESUME'; payload: ResumeData }
  | { type: 'DELETE_RESUME'; payload: string };

const initialState: AppState = {
  resume: createEmptyResume(),
  resumes: [],
  activePanel: 'editor',
  jobDescription: '',
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  zoom: 100,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resume: { ...action.payload, metadata: { ...action.payload.metadata, updatedAt: new Date().toISOString() } } };
    case 'UPDATE_RESUME':
      return { ...state, resume: { ...state.resume, ...action.payload, metadata: { ...state.resume.metadata, updatedAt: new Date().toISOString() } } };
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, resume: { ...state.resume, personalInfo: { ...state.resume.personalInfo, ...action.payload }, metadata: { ...state.resume.metadata, updatedAt: new Date().toISOString() } } };
    case 'SET_PANEL':
      return { ...state, activePanel: action.payload };
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, isDark: !state.isDark };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'NEW_RESUME': {
      const saved = [...state.resumes];
      if (state.resume.personalInfo.fullName) saved.push(state.resume);
      return { ...state, resume: createEmptyResume(), resumes: saved };
    }
    case 'LOAD_SAMPLE':
      return { ...state, resume: { ...sampleResume, metadata: { ...sampleResume.metadata, id: uuid(), updatedAt: new Date().toISOString() } } };
    case 'CLONE_RESUME':
      return { ...state, resume: { ...state.resume, metadata: { ...state.resume.metadata, id: uuid(), name: state.resume.metadata.name + ' (Copy)', createdAt: new Date().toISOString() } } };
    case 'ADD_RESUME':
      return { ...state, resumes: [...state.resumes, action.payload] };
    case 'DELETE_RESUME':
      return { ...state, resumes: state.resumes.filter(r => r.metadata.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  updateField: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateField = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    dispatch({ type: 'UPDATE_RESUME', payload: { [key]: value } as Partial<ResumeData> });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, updateField }}>
      <div className={state.isDark ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
