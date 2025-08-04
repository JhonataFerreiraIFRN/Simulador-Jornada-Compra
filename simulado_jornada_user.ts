
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

