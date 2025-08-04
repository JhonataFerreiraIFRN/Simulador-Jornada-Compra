
/**
 * Interface que define as propriedades de um nó da árvore
 */
interface NodeData {
    id: string;
    question: string;
    description?: string;
    isEndNode?: boolean;
    endMessage?: string;
}

/**
 * Classe que representa um nó na árvore de decisões
 */

class DecisionNode {
    public data: NodeData;
    public children: DecisionNode[];
    public parent: DecisionNode | null;

    constructor(data: NodeData, parent: DecisionNode | null = null) {
        this.data = data;
        this.children = [];
        this.parent = parent;
    }

    /**
     * Adiciona um nó filho
     */

    addChild(childData: NodeData): DecisionNode {
        const childNode = new DecisionNode(childData, this);
        this.children.push(childNode);
        return childNode;
    }

    /**
     * Remove um nó filho pelo ID
     */

    removeChild(childId: string): boolean {
        const index = this.children.findIndex(child => child.data.id === childId);
        if (index !== -1) {
            this.children.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Verifica se é um nó folha (sem filhos)
     */

    isLeaf(): boolean {
        return this.children.length === 0;
    }

    /**
     * Verifica se é um nó final da jornada
     */

    isEndNode(): boolean {
        return this.data.isEndNode === true;
    }
}

