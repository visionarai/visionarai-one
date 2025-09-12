"use client";
import type { ConditionNode } from "@visionarai-one/access-control";
import { createContext, type ReactNode, useContext, useMemo, useReducer } from "react";

// Draft Types ----------------------------------------------------
export type DraftNode = {
	id: string;
	kind: ConditionNode["kind"]; // align with domain
	field?: string;
	op?: string;
	value?: unknown;
	values?: unknown[];
	start?: unknown;
	end?: unknown;
	children?: string[]; // logical
	child?: string; // not
	label: string;
};

export type DraftPermissionDecision = { type: "allow" | "deny" } | { type: "conditional"; root: string | null };

export type DraftPolicy = {
	name: string;
	description?: string;
	globalRoot: string | null;
	nodes: Record<string, DraftNode>;
	nodeOrder: string[]; // stable ordering for UI
	permissions: Record<string, Record<string, DraftPermissionDecision>>; // resource -> action
};

// Actions ---------------------------------------------------------

type Action =
	| { type: "INIT"; payload: DraftPolicy }
	| { type: "ADD_NODE"; node: DraftNode }
	| { type: "UPDATE_NODE"; id: string; patch: Partial<DraftNode> }
	| { type: "REMOVE_NODE"; id: string }
	| { type: "SET_PERMISSION"; resource: string; action: string; decision: DraftPermissionDecision }
	| { type: "SET_GLOBAL_ROOT"; root: string | null };

const addNode = (state: DraftPolicy, node: DraftNode): DraftPolicy => {
	if (state.nodes[node.id]) {
		return state;
	}
	return { ...state, nodeOrder: [...state.nodeOrder, node.id], nodes: { ...state.nodes, [node.id]: node } };
};

const updateNode = (state: DraftPolicy, id: string, patch: Partial<DraftNode>): DraftPolicy => {
	if (!state.nodes[id]) {
		return state;
	}
	return { ...state, nodes: { ...state.nodes, [id]: { ...state.nodes[id], ...patch } } };
};

const removeNode = (state: DraftPolicy, id: string): DraftPolicy => {
	if (!state.nodes[id]) {
		return state;
	}
	if (state.globalRoot === id) {
		return state;
	}
	for (const resource of Object.values(state.permissions)) {
		for (const decision of Object.values(resource)) {
			if (decision.type === "conditional" && decision.root === id) {
				return state;
			}
		}
	}
	const { [id]: _removed, ...rest } = state.nodes;
	return { ...state, nodeOrder: state.nodeOrder.filter((n) => n !== id), nodes: rest };
};

const setPermissionInternal = (state: DraftPolicy, resource: string, action: string, decision: DraftPermissionDecision): DraftPolicy => {
	const current = state.permissions[resource] || {};
	return {
		...state,
		permissions: { ...state.permissions, [resource]: { ...current, [action]: decision } },
	};
};

function reducer(state: DraftPolicy, action: Action): DraftPolicy {
	switch (action.type) {
		case "INIT":
			return action.payload;
		case "ADD_NODE":
			return addNode(state, action.node);
		case "UPDATE_NODE":
			return updateNode(state, action.id, action.patch);
		case "REMOVE_NODE":
			return removeNode(state, action.id);
		case "SET_PERMISSION":
			return setPermissionInternal(state, action.resource, action.action, action.decision);
		case "SET_GLOBAL_ROOT":
			return { ...state, globalRoot: action.root };
		default:
			return state;
	}
}

// Context ---------------------------------------------------------

type Ctx = {
	draft: DraftPolicy;
	addNode: (node: DraftNode) => void;
	updateNode: (id: string, patch: Partial<DraftNode>) => void;
	removeNode: (id: string) => void;
	setPermission: (resource: string, action: string, decision: DraftPermissionDecision) => void;
	setGlobalRoot: (root: string | null) => void;
};

const PolicyEditorContext = createContext<Ctx | null>(null);

export const usePolicyEditor = () => {
	const ctx = useContext(PolicyEditorContext);
	if (!ctx) {
		throw new Error("usePolicyEditor must be used within PolicyEditorProvider");
	}
	return ctx;
};

// Provider --------------------------------------------------------

const emptyDraft: DraftPolicy = {
	description: "",
	globalRoot: null,
	name: "Untitled Policy",
	nodeOrder: [],
	nodes: {},
	permissions: {},
};

export function PolicyEditorProvider({ children, initial }: { children: ReactNode; initial?: Partial<DraftPolicy> }) {
	const [state, dispatch] = useReducer(reducer, { ...emptyDraft, ...initial });

	const api: Ctx = useMemo(
		() => ({
			addNode: (node) => dispatch({ node, type: "ADD_NODE" }),
			draft: state,
			removeNode: (id) => dispatch({ id, type: "REMOVE_NODE" }),
			setGlobalRoot: (root) => dispatch({ root, type: "SET_GLOBAL_ROOT" }),
			setPermission: (resource, action, decision) => dispatch({ action, decision, resource, type: "SET_PERMISSION" }),
			updateNode: (id, patch) => dispatch({ id, patch, type: "UPDATE_NODE" }),
		}),
		[state]
	);

	return <PolicyEditorContext.Provider value={api}>{children}</PolicyEditorContext.Provider>;
}
