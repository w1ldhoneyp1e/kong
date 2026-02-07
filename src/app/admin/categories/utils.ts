import {type CategoryTreeNode} from '../../../entities/category'

type VisibleNode = {
	node: CategoryTreeNode,
	depth: number,
}

function collectAllIds(nodes: CategoryTreeNode[]): Set<string> {
	const ids = new Set<string>()
	for (const node of nodes) {
		ids.add(node.id)
		for (const id of collectAllIds(node.children)) {
			ids.add(id)
		}
	}
	return ids
}

function getVisibleNodes(
	nodes: CategoryTreeNode[],
	expandedIds: Set<string>,
	depth = 0,
): VisibleNode[] {
	const result: VisibleNode[] = []
	for (const node of nodes) {
		result.push({
			node,
			depth,
		})
		if (node.children.length > 0 && expandedIds.has(node.id)) {
			result.push(...getVisibleNodes(node.children, expandedIds, depth + 1))
		}
	}
	return result
}

export {
	collectAllIds,
	getVisibleNodes,
}
export type {VisibleNode}
