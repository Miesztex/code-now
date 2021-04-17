import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
		// '123': { id: '123', ...}
	};
}

const initialState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};
// (
//state -> ..., cells-state interface-> ..., cell -> cell type
//action -> one of: action inteface -> action type, payload
// ) :
// return: CellsState
const reducer = produce(
	(state: CellsState = initialState, action: Action): CellsState => {
		switch (action.type) {
			// ===================================
			// FETCH/SAVE CELLS
			// ===================================
			case ActionType.FETCH_CELLS:
				state.loading = true;
				state.error = null;
				return state;

			case ActionType.FETCH_CELLS_ERROR:
				state.loading = false;
				state.error = action.payload;
				return state;

			case ActionType.FETCH_CELLS_COMPLETE:
				state.order = action.payload.map(cell => cell.id);
				state.data = action.payload.reduce((acc, cell) => {
					acc[cell.id] = cell;
					return acc;
				}, {} as CellsState['data']);
				state.loading = false;
				state.error = null;
				return state;

			case ActionType.SAVE_CELLS_ERROR:
				state.error = action.payload;
				return state;

			// ===================================
			// CELLS ACTIONS
			// ===================================
			case ActionType.UPDATE_CELL:
				const { id, content } = action.payload;
				state.data[id].content = content;
				return state;

			case ActionType.DELETE_CELL:
				delete state.data[action.payload];
				state.order = state.order.filter(id => id !== action.payload);
				return state;

			case ActionType.MOVE_CELL:
				const { direction } = action.payload;
				const { order } = state;
				const idx = order.findIndex(id => id === action.payload.id);
				const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
				if (targetIdx < 0 || targetIdx > state.order.length - 1) return state;
				//swap operation
				[order[idx], order[targetIdx]] = [order[targetIdx], order[idx]];
				return state;

			case ActionType.INSERT_CELL_AFTER:
				const cell: Cell = {
					id: getRandomId(),
					type: action.payload.type,
					content: '',
				};
				// add to data
				state.data[cell.id] = cell;
				// change order
				const index = state.order.findIndex(id => id === action.payload.id);
				if (index < 0) state.order.unshift(cell.id);
				else state.order.splice(index + 1, 0, cell.id);
				return state;

			default:
				return state;
		}
	}
);

const getRandomId = () => {
	return Math.random().toString(36).substr(2, 5);
};

export default reducer;
