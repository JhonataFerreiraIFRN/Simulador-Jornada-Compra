
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

/**
 * Classe principal que gerencia a árvore de decisões da jornada de compra
 */

class CustomerJourneyTree {
    private root: DecisionNode | null;
    private currentPath: DecisionNode[];

    constructor() {
        this.root = null;
        this.currentPath = [];
    }

    /**
     * Define o nó raiz da árvore
     */

    setRoot(rootData: NodeData): DecisionNode {
        this.root = new DecisionNode(rootData);
        return this.root;
    }

    /**
     * Obtém o nó raiz
     */

    getRoot(): DecisionNode | null {
        return this.root;
    }

    /**
     * Busca um nó pelo ID usando busca em largura (BFS)
     */

    findNodeById(id: string): DecisionNode | null {
        if (!this.root) return null;

        const queue: DecisionNode[] = [this.root];
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            
            if (current.data.id === id) {
                return current;
            }
            
            queue.push(...current.children);
        }
        
        return null;
    }

    /**
     * Adiciona um nó filho a um nó pai específico
     */

    addNode(parentId: string, childData: NodeData): DecisionNode | null {
        const parentNode = this.findNodeById(parentId);
        if (parentNode) {
            return parentNode.addChild(childData);
        }
        return null;
    }

    /**
     * Remove um nó e todos os seus descendentes
     */

    removeNode(nodeId: string): boolean {
        const node = this.findNodeById(nodeId);
        if (!node || !node.parent) return false;

        return node.parent.removeChild(nodeId);
    }

    /**
     * Inicia uma nova jornada do usuário
     */

    startJourney(): DecisionNode | null {
        if (!this.root) return null;
        
        this.currentPath = [this.root];
        return this.root;
    }

    /**
     * Navega para um nó filho durante a jornada
     */

    navigateToChild(childId: string): DecisionNode | null {
        if (this.currentPath.length === 0) return null;

        const currentNode = this.currentPath[this.currentPath.length - 1];
        const childNode = currentNode.children.find(child => child.data.id === childId);
        
        if (childNode) {
            this.currentPath.push(childNode);
            return childNode;
        }
        
        return null;
    }

    /**
     * Volta um passo na jornada
     */

    goBack(): DecisionNode | null {
        if (this.currentPath.length <= 1) return null;
        
        this.currentPath.pop();
        return this.currentPath[this.currentPath.length - 1];
    }

    /**
     * Obtém o caminho atual da jornada
     */

    getCurrentPath(): DecisionNode[] {
        return [...this.currentPath];
    }

    /**
     * Obtém o nó atual da jornada
     */

    getCurrentNode(): DecisionNode | null {
        return this.currentPath.length > 0 ? this.currentPath[this.currentPath.length - 1] : null;
    }

    /**
     * Realiza um percurso em profundidade (DFS) da árvore
     */

    depthFirstTraversal(callback: (node: DecisionNode, depth: number) => void): void {
        if (!this.root) return;

        const dfs = (node: DecisionNode, depth: number) => {
            callback(node, depth);
            node.children.forEach(child => dfs(child, depth + 1));
        };

        dfs(this.root, 0);
    }

    /**
     * Realiza um percurso em largura (BFS) da árvore
     */

    breadthFirstTraversal(callback: (node: DecisionNode, depth: number) => void): void {
        if (!this.root) return;

        const queue: { node: DecisionNode; depth: number }[] = [{ node: this.root, depth: 0 }];
        
        while (queue.length > 0) {
            const { node, depth } = queue.shift()!;
            callback(node, depth);
            
            node.children.forEach(child => {
                queue.push({ node: child, depth: depth + 1 });
            });
        }
    }

    /**
     * Obtém todas as folhas (nós finais) da árvore
     */

    getLeafNodes(): DecisionNode[] {
        const leaves: DecisionNode[] = [];
        
        this.depthFirstTraversal((node) => {
            if (node.isLeaf()) {
                leaves.push(node);
            }
        });
        
        return leaves;
    }

    /**
     * Obtém a altura da árvore
     */

    getTreeHeight(): number {
        if (!this.root) return 0;

        const getHeight = (node: DecisionNode): number => {
            if (node.children.length === 0) return 1;
            return 1 + Math.max(...node.children.map(child => getHeight(child)));
        };

        return getHeight(this.root);
    }

    /**
     * Converte a árvore para um objeto JSON para serialização
     */

    toJSON(): any {
        if (!this.root) return null;

        const nodeToJSON = (node: DecisionNode): any => {
            return {
                data: node.data,
                children: node.children.map(child => nodeToJSON(child))
            };
        };

        return nodeToJSON(this.root);
    }

    /**
     * Carrega uma árvore a partir de um objeto JSON
     */

    fromJSON(jsonData: any): void {
        if (!jsonData) return;

        const jsonToNode = (jsonNode: any, parent: DecisionNode | null = null): DecisionNode => {
            const node = new DecisionNode(jsonNode.data, parent);
            
            if (jsonNode.children && jsonNode.children.length > 0) {
                jsonNode.children.forEach((childJson: any) => {
                    const childNode = jsonToNode(childJson, node);
                    node.children.push(childNode);
                });
            }
            
            return node;
        };

        this.root = jsonToNode(jsonData);
        this.currentPath = [];
    }
}

// Classe para gerenciar a interface do usuário
class JourneyUI {
    private tree: CustomerJourneyTree;
    private treeContainer: HTMLElement;
    private journeyContainer: HTMLElement;
    private pathContainer: HTMLElement;

    constructor() {
        this.tree = new CustomerJourneyTree();
        this.treeContainer = document.getElementById('tree-container')!;
        this.journeyContainer = document.getElementById('journey-container')!;
        this.pathContainer = document.getElementById('path-container')!;
        
        this.initializeEventListeners();
        this.createSampleTree();
    }

    /**
     * Inicializa os event listeners da interface
     */

    private initializeEventListeners(): void {
        // Botão para adicionar nó
        const addNodeBtn = document.getElementById('add-node-btn');
        if (addNodeBtn) {
            addNodeBtn.addEventListener('click', () => this.showAddNodeModal());
        }

        // Botão para iniciar jornada
        const startJourneyBtn = document.getElementById('start-journey-btn');
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => this.startJourney());
        }

        // Botão para voltar na jornada
        const goBackBtn = document.getElementById('go-back-btn');
        if (goBackBtn) {
            goBackBtn.addEventListener('click', () => this.goBack());
        }

        // Botão para resetar jornada
        const resetJourneyBtn = document.getElementById('reset-journey-btn');
        if (resetJourneyBtn) {
            resetJourneyBtn.addEventListener('click', () => this.resetJourney());
        }
    }

    /**
     * Cria uma árvore de exemplo para demonstração
     */

    private createSampleTree(): void {
        // Nó raiz
        const root = this.tree.setRoot({
            id: 'root',
            question: 'Você está interessado em comprar um produto?',
            description: 'Início da jornada de compra'
        });

        // Primeiro nível
        const yesNode = root.addChild({
            id: 'yes-interested',
            question: 'Que tipo de produto você procura?',
            description: 'Cliente demonstrou interesse'
        });

        const noNode = root.addChild({
            id: 'no-interested',
            question: 'Gostaria de saber mais sobre nossos produtos?',
            description: 'Cliente não demonstrou interesse inicial'
        });

        // Segundo nível - Ramo "Sim"
        yesNode.addChild({
            id: 'electronics',
            question: 'Qual é seu orçamento para eletrônicos?',
            description: 'Interesse em eletrônicos'
        });

        yesNode.addChild({
            id: 'clothing',
            question: 'Que estilo de roupa você prefere?',
            description: 'Interesse em roupas'
        });

        yesNode.addChild({
            id: 'books',
            question: 'Que gênero de livro você gosta?',
            description: 'Interesse em livros'
        });

        // Segundo nível - Ramo "Não"
        noNode.addChild({
            id: 'newsletter',
            question: 'Deseja receber nossa newsletter?',
            description: 'Oferta de newsletter',
            isEndNode: true,
            endMessage: 'Obrigado! Você receberá nossas novidades por email.'
        });

        noNode.addChild({
            id: 'no-thanks',
            question: '',
            description: 'Cliente não tem interesse',
            isEndNode: true,
            endMessage: 'Tudo bem! Volte sempre que quiser.'
        });

        // Terceiro nível - Eletrônicos
        const electronicsNode = this.tree.findNodeById('electronics');
        if (electronicsNode) {
            electronicsNode.addChild({
                id: 'budget-low',
                question: 'Produtos até R$ 500',
                description: 'Orçamento baixo',
                isEndNode: true,
                endMessage: 'Confira nossa seleção de produtos econômicos!'
            });

            electronicsNode.addChild({
                id: 'budget-medium',
                question: 'Produtos de R$ 500 a R$ 2000',
                description: 'Orçamento médio',
                isEndNode: true,
                endMessage: 'Temos ótimas opções intermediárias para você!'
            });

            electronicsNode.addChild({
                id: 'budget-high',
                question: 'Produtos acima de R$ 2000',
                description: 'Orçamento alto',
                isEndNode: true,
                endMessage: 'Conheça nossa linha premium!'
            });
        }

        this.renderTree();
    }

    /**
     * Renderiza a visualização da árvore
     */

    private renderTree(): void {
        this.treeContainer.innerHTML = '';
        
        if (!this.tree.getRoot()) return;

        const treeElement = this.createTreeElement(this.tree.getRoot()!);
        this.treeContainer.appendChild(treeElement);
    }

    /**
     * Cria um elemento HTML para representar um nó da árvore
     */

    private createTreeElement(node: DecisionNode): HTMLElement {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.setAttribute('data-node-id', node.data.id);

        const nodeContent = document.createElement('div');
        nodeContent.className = 'node-content';
        
        const nodeTitle = document.createElement('div');
        nodeTitle.className = 'node-title';
        nodeTitle.textContent = node.data.question || node.data.description || node.data.id;
        
        const nodeActions = document.createElement('div');
        nodeActions.className = 'node-actions';
        
        // Botão para adicionar filho

        if (!node.isEndNode()) {
            const addChildBtn = document.createElement('button');
            addChildBtn.textContent = '+';
            addChildBtn.className = 'add-child-btn';
            addChildBtn.onclick = () => this.showAddChildModal(node.data.id);
            nodeActions.appendChild(addChildBtn);
        }
        
        // Botão para remover nó (exceto raiz)
        if (node.parent) {

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-node-btn';
            removeBtn.onclick = () => this.removeNode(node.data.id);
            nodeActions.appendChild(removeBtn);
        }

        nodeContent.appendChild(nodeTitle);
        nodeContent.appendChild(nodeActions);
        nodeElement.appendChild(nodeContent);

        // Adiciona filhos
        if (node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            
            node.children.forEach(child => {
                const childElement = this.createTreeElement(child);
                childrenContainer.appendChild(childElement);
            });
            
            nodeElement.appendChild(childrenContainer);
        }

        return nodeElement;
    }

    /**
     * Inicia a jornada do usuário
     */

    private startJourney(): void {
        const startNode = this.tree.startJourney();
        if (startNode) {
            this.renderJourneyStep(startNode);
            this.updatePathDisplay();
        }
    }

    /**
     * Renderiza um passo da jornada
     */

    private renderJourneyStep(node: DecisionNode): void {
        this.journeyContainer.innerHTML = '';

        const stepElement = document.createElement('div');
        stepElement.className = 'journey-step';

        const questionElement = document.createElement('h3');
        questionElement.textContent = node.data.question;
        stepElement.appendChild(questionElement);

        if (node.data.description) {
            const descElement = document.createElement('p');
            descElement.textContent = node.data.description;
            stepElement.appendChild(descElement);
        }

        // Se é um nó final

        if (node.isEndNode() && node.data.endMessage) {
            const endMessageElement = document.createElement('div');
            endMessageElement.className = 'end-message';
            endMessageElement.textContent = node.data.endMessage;
            stepElement.appendChild(endMessageElement);
        } else if (node.children.length > 0) {
            // Mostra opções de escolha
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'journey-options';

            node.children.forEach(child => {
                const optionButton = document.createElement('button');
                optionButton.className = 'journey-option-btn';
                optionButton.textContent = child.data.question || child.data.description || child.data.id;
                optionButton.onclick = () => this.navigateToChild(child.data.id);
                optionsContainer.appendChild(optionButton);
            });

            stepElement.appendChild(optionsContainer);
        }

        this.journeyContainer.appendChild(stepElement);
    }

    /**
     * Navega para um nó filho durante a jornada
     */

    private navigateToChild(childId: string): void {
        const childNode = this.tree.navigateToChild(childId);
        if (childNode) {
            this.renderJourneyStep(childNode);
            this.updatePathDisplay();
        }
    }

    /**
     * Volta um passo na jornada
     */

    private goBack(): void {
        const previousNode = this.tree.goBack();
        if (previousNode) {
            this.renderJourneyStep(previousNode);
            this.updatePathDisplay();
        }
    }

    /**
     * Reseta a jornada
     */

    private resetJourney(): void {
        this.journeyContainer.innerHTML = '<p>Clique em "Iniciar Jornada" para começar.</p>';
        this.pathContainer.innerHTML = '';
    }

    /**
     * Atualiza a exibição do caminho percorrido
     */

    private updatePathDisplay(): void {
        const path = this.tree.getCurrentPath();
        this.pathContainer.innerHTML = '';

        if (path.length === 0) return;

        const pathTitle = document.createElement('h4');
        pathTitle.textContent = 'Caminho Percorrido:';
        this.pathContainer.appendChild(pathTitle);

        const pathList = document.createElement('ol');
        pathList.className = 'path-list';

        path.forEach((node, index) => {
            const pathItem = document.createElement('li');
            pathItem.textContent = node.data.question || node.data.description || node.data.id;
            
            if (index === path.length - 1) {
                pathItem.className = 'current-step';
            }
            
            pathList.appendChild(pathItem);
        });

        this.pathContainer.appendChild(pathList);
    }

    /**
     * Mostra modal para adicionar novo nó
     */

    private showAddNodeModal(): void {
        const modal = this.createModal('Adicionar Nó', [
            { label: 'ID do Nó:', type: 'text', id: 'node-id', required: true },
            { label: 'Pergunta/Texto:', type: 'text', id: 'node-question', required: true },
            { label: 'Descrição:', type: 'text', id: 'node-description' },
            { label: 'É nó final?', type: 'checkbox', id: 'node-is-end' },
            { label: 'Mensagem final:', type: 'text', id: 'node-end-message' }
        ], (formData) => {
            // Implementar lógica para adicionar nó
            console.log('Adicionar nó:', formData);
        });
        
        document.body.appendChild(modal);
    }

    /**
     * Mostra modal para adicionar nó filho
     */

    private showAddChildModal(parentId: string): void {
        const modal = this.createModal('Adicionar Nó Filho', [
            { label: 'ID do Nó:', type: 'text', id: 'child-id', required: true },
            { label: 'Pergunta/Texto:', type: 'text', id: 'child-question', required: true },
            { label: 'Descrição:', type: 'text', id: 'child-description' },
            { label: 'É nó final?', type: 'checkbox', id: 'child-is-end' },
            { label: 'Mensagem final:', type: 'text', id: 'child-end-message' }
        ], (formData) => {
            const childData: NodeData = {
                id: formData['child-id'],
                question: formData['child-question'],
                description: formData['child-description'] || undefined,
                isEndNode: formData['child-is-end'] || false,
                endMessage: formData['child-end-message'] || undefined
            };

            const newNode = this.tree.addNode(parentId, childData);
            if (newNode) {
                this.renderTree();
            }
        });
        
        document.body.appendChild(modal);
    }

    /**
     * Remove um nó da árvore
     */

    private removeNode(nodeId: string): void {
        if (confirm('Tem certeza que deseja remover este nó e todos os seus filhos?')) {
            if (this.tree.removeNode(nodeId)) {
                this.renderTree();
            }
        }
    }

    /**
     * Cria um modal genérico
     */

    private createModal(title: string, fields: any[], onSubmit: (formData: any) => void): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalHeader = document.createElement('h3');
        modalHeader.textContent = title;
        modalContent.appendChild(modalHeader);
        
        const form = document.createElement('form');
        
        fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'field-container';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.id);
            
            let input: HTMLInputElement | HTMLTextAreaElement;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            
            input.id = field.id;
            input.name = field.id;
            if (field.required) input.required = true;
            
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            form.appendChild(fieldContainer);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Adicionar';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => document.body.removeChild(modal);
        
        buttonContainer.appendChild(submitBtn);
        buttonContainer.appendChild(cancelBtn);
        form.appendChild(buttonContainer);
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData: any = {};
            fields.forEach(field => {
                const element = form.elements.namedItem(field.id) as HTMLInputElement;
                if (field.type === 'checkbox') {
                    formData[field.id] = element.checked;
                } else {
                    formData[field.id] = element.value;
                }
            });
            onSubmit(formData);
            document.body.removeChild(modal);
        };
        
        modalContent.appendChild(form);
        modal.appendChild(modalContent);
        
        return modal;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new JourneyUI();
});
