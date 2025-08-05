# Simulador de Jornada de Compra do Usuário

## 📋 Visão Geral

O **Simulador de Jornada de Compra do Usuário** é uma aplicação web interativa desenvolvida para visualizar e simular as decisões que um cliente toma durante sua jornada de compra. Utilizando estruturas de dados em árvore implementadas em TypeScript, o sistema permite criar, gerenciar e navegar por cenários de decisão complexos, oferecendo insights valiosos sobre o comportamento do consumidor.

Este projeto foi desenvolvido como parte de um trabalho acadêmico focado em estruturas de dados hierárquicas, demonstrando a aplicação prática de árvores de decisão em contextos reais de marketing e vendas.

## 🎯 Objetivos

- **Modelagem Hierárquica**: Implementar uma estrutura de árvore robusta para representar decisões e caminhos de compra
- **Interface Interativa**: Criar uma experiência visual intuitiva para construção e navegação de jornadas
- **Simulação Realística**: Permitir a simulação de diferentes cenários de decisão do cliente
- **Análise de Caminhos**: Rastrear e visualizar os caminhos percorridos durante as jornadas
- **Flexibilidade**: Oferecer ferramentas para criação dinâmica de novos nós e cenários

## 🏗️ Arquitetura Técnica

### Estrutura de Dados

O sistema utiliza uma implementação personalizada de árvore binária com as seguintes características:

#### Classe `DecisionNode`
```typescript
class DecisionNode {
    public data: NodeData;
    public children: DecisionNode[];
    public parent: DecisionNode | null;
}
```

Cada nó da árvore contém:
- **ID único**: Identificador exclusivo para referência
- **Pergunta/Texto**: Conteúdo apresentado ao usuário
- **Descrição**: Informações adicionais sobre o nó
- **Flag de nó final**: Indica se é um ponto de conclusão da jornada
- **Mensagem final**: Texto exibido ao concluir uma jornada

#### Classe `CustomerJourneyTree`
```typescript
class CustomerJourneyTree {
    private root: DecisionNode | null;
    private currentPath: DecisionNode[];
}
```

Gerencia toda a estrutura da árvore com funcionalidades para:
- **Inserção e remoção** de nós
- **Busca** por ID usando algoritmos BFS e DFS
- **Navegação** durante simulações
- **Serialização** para JSON
- **Análise** de caminhos e estatísticas

### Algoritmos Implementados

#### Busca em Largura (BFS)
Utilizada para encontrar nós por ID de forma eficiente:
```typescript
findNodeById(id: string): DecisionNode | null {
    const queue: DecisionNode[] = [this.root];
    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.data.id === id) return current;
        queue.push(...current.children);
    }
    return null;
}
```

#### Percurso em Profundidade (DFS)
Usado para análises completas da árvore:
```typescript
depthFirstTraversal(callback: (node: DecisionNode, depth: number) => void): void {
    const dfs = (node: DecisionNode, depth: number) => {
        callback(node, depth);
        node.children.forEach(child => dfs(child, depth + 1));
    };
    dfs(this.root, 0);
}
```

## 🎨 Interface do Usuário

### Design System

A interface foi desenvolvida seguindo princípios modernos de UX/UI:

- **Paleta de Cores**: Gradientes em tons de azul e roxo para transmitir profissionalismo
- **Typography**: Fonte Segoe UI para máxima legibilidade
- **Layout Responsivo**: Grid CSS adaptável para diferentes dispositivos
- **Micro-interações**: Animações suaves para melhor feedback visual
- **Acessibilidade**: Contraste adequado e navegação por teclado

### Componentes Principais

#### 1. Painel de Controles
- Botões para iniciar jornada, voltar, resetar e adicionar nós
- Design com ícones intuitivos e cores semânticas
- Posicionamento fixo para acesso rápido

#### 2. Visualização da Árvore
- Representação hierárquica visual dos nós
- Conexões visuais entre nós pai e filhos
- Botões de ação (adicionar/remover) em cada nó
- Scroll horizontal para árvores extensas

#### 3. Simulador de Jornada
- Interface dinâmica que se adapta ao nó atual
- Botões de opção para navegação
- Mensagens de finalização personalizadas
- Feedback visual do progresso

#### 4. Rastreamento de Caminho
- Lista numerada dos passos percorridos
- Destaque do passo atual
- Contador de passos totais
- Histórico completo da navegação

## 🚀 Funcionalidades

### Gerenciamento de Árvore

#### Criação de Nós
- **Interface Modal**: Formulário intuitivo para criação de novos nós
- **Validação**: Verificação de campos obrigatórios
- **Tipos de Nó**: Suporte para nós intermediários e finais
- **Hierarquia**: Adição de nós filhos em qualquer ponto da árvore

#### Remoção de Nós
- **Confirmação**: Dialog de confirmação para evitar exclusões acidentais
- **Cascata**: Remoção automática de todos os nós descendentes
- **Integridade**: Manutenção da consistência da árvore

#### Edição Dinâmica
- **Modificação em Tempo Real**: Alterações refletidas imediatamente na interface
- **Persistência**: Manutenção do estado durante a sessão
- **Desfazer**: Possibilidade de reverter alterações (futuro)

### Simulação de Jornada

#### Navegação Interativa
- **Início Automático**: Começa sempre pelo nó raiz
- **Escolhas Múltiplas**: Suporte para múltiplas opções por nó
- **Navegação Livre**: Possibilidade de voltar e explorar diferentes caminhos

#### Rastreamento de Progresso
- **Caminho Completo**: Registro de todos os passos da jornada
- **Estatísticas**: Contagem de passos e tempo de navegação
- **Análise**: Identificação de padrões de comportamento

#### Finalização de Jornada
- **Nós Terminais**: Identificação clara de pontos de conclusão
- **Mensagens Personalizadas**: Feedback específico para cada final
- **Reinício**: Facilidade para começar nova jornada

### Operações Avançadas

#### Serialização
```typescript
toJSON(): any {
    // Converte a árvore completa para formato JSON
    // Permite salvar e carregar configurações
}

fromJSON(jsonData: any): void {
    // Reconstrói a árvore a partir de dados JSON
    // Facilita backup e restauração
}
```

#### Análise Estatística
- **Altura da Árvore**: Cálculo da profundidade máxima
- **Nós Folha**: Identificação de todos os pontos finais
- **Caminhos Possíveis**: Enumeração de todas as jornadas possíveis
- **Complexidade**: Análise da complexidade da estrutura

## 📊 Casos de Uso

### Marketing Digital
- **Funis de Conversão**: Modelagem de etapas de conversão
- **Segmentação**: Criação de jornadas específicas por perfil
- **A/B Testing**: Comparação de diferentes fluxos de decisão
- **Otimização**: Identificação de pontos de abandono

### E-commerce
- **Processo de Compra**: Simulação do checkout
- **Recomendações**: Árvores de produtos relacionados
- **Suporte**: Fluxos de atendimento ao cliente
- **Onboarding**: Jornadas de integração de novos usuários

### Pesquisa de Mercado
- **Comportamento do Consumidor**: Análise de padrões de decisão
- **Personas**: Criação de jornadas por tipo de cliente
- **Insights**: Descoberta de oportunidades de melhoria
- **Validação**: Teste de hipóteses sobre preferências

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização avançada com Grid e Flexbox
- **TypeScript**: Linguagem principal com tipagem estática
- **Vanilla JavaScript**: Manipulação do DOM sem frameworks

### Estruturas de Dados
- **Árvores**: Implementação personalizada de árvore n-ária
- **Filas**: Para algoritmos de busca em largura
- **Pilhas**: Para navegação e histórico
- **Arrays**: Para gerenciamento de caminhos

### Ferramentas de Desenvolvimento
- **TypeScript Compiler**: Transpilação para JavaScript
- **HTTP Server**: Servidor local para desenvolvimento
- **Browser DevTools**: Debug e otimização
- **Git**: Controle de versão (recomendado)

## 📁 Estrutura do Projeto

```
simulador-jornada-compra/
├── index.html          # Estrutura principal da aplicação
├── style.css           # Estilos e design system
├── script.ts           # Código TypeScript principal
├── script.js           # JavaScript compilado
└── README.md           # Esta documentação
```

### Organização do Código

#### `index.html`
- Estrutura semântica com seções bem definidas
- Elementos de interface organizados hierarquicamente
- IDs e classes consistentes para manipulação via JavaScript
- Meta tags para responsividade e SEO

#### `style.css`
- Variáveis CSS para consistência visual
- Media queries para responsividade
- Animações e transições suaves
- Sistema de cores e tipografia padronizado

#### `script.ts`
- Classes organizadas por responsabilidade
- Interfaces TypeScript para type safety
- Comentários JSDoc para documentação
- Padrões de design bem definidos

## 🚦 Como Usar

### Instalação

1. **Clone ou baixe** os arquivos do projeto
2. **Instale o TypeScript** globalmente (se necessário):
   ```bash
   npm install -g typescript
   ```
3. **Compile o TypeScript**:
   ```bash
   tsc script.ts --target es2017 --lib dom,es2017
   ```
4. **Inicie um servidor local**:
   ```bash
   python3 -m http.server 8000
   # ou
   npx serve .
   ```
5. **Acesse** `http://localhost:8000` no navegador

### Uso Básico

#### 1. Visualização Inicial
- Ao abrir a aplicação, você verá uma árvore de exemplo pré-carregada
- A árvore demonstra um cenário típico de jornada de compra
- Explore a visualização hierárquica na seção "Árvore de Decisões"

#### 2. Simulação de Jornada
- Clique em **"Iniciar Jornada"** para começar uma simulação
- Siga as opções apresentadas clicando nos botões azuis
- Observe o caminho sendo construído na seção "Caminho Percorrido"
- Use **"Voltar"** para retroceder ou **"Resetar"** para recomeçar

#### 3. Adição de Nós
- Clique no botão **"+"** verde em qualquer nó para adicionar um filho
- Preencha o formulário modal com as informações do novo nó
- Marque "É nó final?" se for um ponto de conclusão
- Adicione uma mensagem final personalizada se necessário

#### 4. Remoção de Nós
- Clique no botão **"×"** vermelho para remover um nó
- Confirme a ação no dialog de confirmação
- Todos os nós filhos serão removidos automaticamente

### Uso Avançado

#### Criação de Cenários Complexos
1. **Planeje a Estrutura**: Desenhe a jornada no papel primeiro
2. **Comece pelo Topo**: Sempre inicie pelo nó raiz
3. **Construa Gradualmente**: Adicione nós nível por nível
4. **Teste Frequentemente**: Simule jornadas durante a construção
5. **Refine Mensagens**: Ajuste textos para máxima clareza

#### Análise de Resultados
1. **Execute Múltiplas Simulações**: Teste diferentes caminhos
2. **Observe Padrões**: Identifique rotas mais comuns
3. **Identifique Gargalos**: Encontre pontos de decisão complexos
4. **Otimize Fluxos**: Simplifique jornadas quando possível

## 🧪 Exemplos de Uso

### Exemplo 1: E-commerce de Eletrônicos

```
Interessado em comprar?
├── Sim → Que tipo de produto?
│   ├── Eletrônicos → Qual orçamento?
│   │   ├── Até R$ 500 → [FINAL] Produtos econômicos
│   │   ├── R$ 500-2000 → [FINAL] Linha intermediária
│   │   └── Acima R$ 2000 → [FINAL] Linha premium
│   ├── Roupas → Que estilo?
│   └── Livros → Que gênero?
└── Não → Quer saber mais?
    ├── Sim → [FINAL] Newsletter
    └── Não → [FINAL] Obrigado
```

### Exemplo 2: Suporte Técnico

```
Qual seu problema?
├── Login → Esqueceu senha?
│   ├── Sim → [FINAL] Reset de senha
│   └── Não → [FINAL] Verificar conta
├── Pagamento → Que tipo de erro?
│   ├── Cartão recusado → [FINAL] Contatar banco
│   └── Cobrança duplicada → [FINAL] Estorno
└── Produto → [FINAL] Suporte especializado
```

### Exemplo 3: Onboarding de App

```
Primeiro acesso?
├── Sim → Que funcionalidade interessa?
│   ├── Produtividade → [FINAL] Tutorial básico
│   ├── Social → [FINAL] Conectar amigos
│   └── Entretenimento → [FINAL] Conteúdo recomendado
└── Não → Precisa de ajuda?
    ├── Sim → [FINAL] Central de ajuda
    └── Não → [FINAL] Bem-vindo de volta
```

## 🔧 Personalização

### Modificação de Estilos

#### Cores Principais
```css
:root {
    --primary-color: #2563eb;      /* Azul principal */
    --success-color: #059669;      /* Verde para ações positivas */
    --warning-color: #d97706;      /* Laranja para avisos */
    --danger-color: #dc2626;       /* Vermelho para ações destrutivas */
}
```

#### Tipografia
```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    line-height: 1.6;
}
```

#### Layout Responsivo
```css
@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
        grid-template-areas: 
            "controls"
            "tree"
            "journey"
            "path";
    }
}
```

### Extensão de Funcionalidades

#### Adição de Novos Tipos de Nó
```typescript
interface NodeData {
    id: string;
    question: string;
    description?: string;
    isEndNode?: boolean;
    endMessage?: string;
    // Adicione novos campos aqui
    priority?: number;
    category?: string;
    metadata?: any;
}
```

#### Implementação de Novos Algoritmos
```typescript
// Exemplo: Busca por categoria
findNodesByCategory(category: string): DecisionNode[] {
    const results: DecisionNode[] = [];
    this.depthFirstTraversal((node) => {
        if (node.data.category === category) {
            results.push(node);
        }
    });
    return results;
}
```

## 📈 Métricas e Analytics

### Métricas Básicas
- **Altura da Árvore**: Profundidade máxima da estrutura
- **Número de Nós**: Total de pontos de decisão
- **Nós Folha**: Quantidade de finalizações possíveis
- **Fator de Ramificação**: Média de filhos por nó

### Métricas de Jornada
- **Passos por Jornada**: Quantidade média de decisões
- **Taxa de Conclusão**: Percentual de jornadas finalizadas
- **Caminhos Mais Populares**: Rotas mais frequentemente seguidas
- **Pontos de Abandono**: Nós onde usuários param mais

### Implementação de Tracking

```typescript
class JourneyAnalytics {
    private journeys: Journey[] = [];
    
    trackJourney(path: DecisionNode[]): void {
        this.journeys.push({
            path: path.map(node => node.data.id),
            timestamp: new Date(),
            completed: path[path.length - 1].isEndNode()
        });
    }
    
    getPopularPaths(): string[][] {
        // Retorna os caminhos mais seguidos
    }
}
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. TypeScript não compila
**Sintoma**: Erros de compilação ou arquivo .js não é gerado
**Solução**:
```bash
# Verifique a instalação do TypeScript
tsc --version

# Reinstale se necessário
npm install -g typescript

# Compile com flags específicas
tsc script.ts --target es2017 --lib dom,es2017 --strict false
```

#### 2. Interface não carrega
**Sintoma**: Página em branco ou erros no console
**Solução**:
- Verifique se o arquivo `script.js` foi gerado
- Confirme que o servidor está rodando na porta correta
- Abra o DevTools e verifique erros JavaScript

#### 3. Modal não abre
**Sintoma**: Clique em botões não abre formulários
**Solução**:
- Verifique se os event listeners foram registrados
- Confirme que os IDs dos elementos estão corretos
- Teste em modo de desenvolvimento com console aberto

#### 4. Jornada não navega
**Sintoma**: Cliques em opções não avançam a jornada
**Solução**:
- Verifique se a árvore foi inicializada corretamente
- Confirme que os nós têm IDs únicos
- Teste a estrutura da árvore no console

### Debug Avançado

#### Console Commands
```javascript
// Inspecionar a árvore atual
window.journeyUI.tree.toJSON()

// Ver caminho atual
window.journeyUI.tree.getCurrentPath()

// Encontrar nó específico
window.journeyUI.tree.findNodeById('node-id')

// Estatísticas da árvore
console.log('Altura:', window.journeyUI.tree.getTreeHeight())
console.log('Folhas:', window.journeyUI.tree.getLeafNodes().length)
```

#### Logging Personalizado
```typescript
class Logger {
    static debug(message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${message}`, data);
        }
    }
    
    static error(message: string, error?: Error): void {
        console.error(`[ERROR] ${message}`, error);
    }
}
```

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

#### 1. Persistência de Dados
- **Local Storage**: Salvar árvores no navegador
- **Export/Import**: Arquivos JSON para backup
- **Cloud Sync**: Sincronização entre dispositivos
- **Histórico**: Versionamento de alterações

#### 2. Analytics Avançados
- **Heatmaps**: Visualização de caminhos populares
- **Funis**: Análise de conversão por etapa
- **Segmentação**: Análise por tipo de usuário
- **Relatórios**: Dashboards com métricas

#### 3. Colaboração
- **Multi-usuário**: Edição colaborativa
- **Comentários**: Anotações em nós
- **Aprovações**: Workflow de revisão
- **Permissões**: Controle de acesso

#### 4. Integração
- **APIs**: Conexão com sistemas externos
- **Webhooks**: Notificações automáticas
- **CRM**: Integração com ferramentas de vendas
- **Analytics**: Google Analytics, Mixpanel

### Otimizações Técnicas

#### Performance
- **Lazy Loading**: Carregamento sob demanda
- **Virtual Scrolling**: Para árvores grandes
- **Memoization**: Cache de cálculos complexos
- **Web Workers**: Processamento em background

#### Acessibilidade
- **Screen Readers**: Suporte completo
- **Navegação por Teclado**: Atalhos e foco
- **Alto Contraste**: Modo para baixa visão
- **Internacionalização**: Múltiplos idiomas

#### Mobile
- **Touch Gestures**: Navegação por gestos
- **Responsive**: Layout otimizado
- **PWA**: Instalação como app
- **Offline**: Funcionamento sem internet

## 📚 Referências Técnicas

### Estruturas de Dados
- **Árvores**: Conceitos fundamentais e implementações
- **Grafos**: Extensões possíveis para cenários complexos
- **Algoritmos de Busca**: BFS, DFS e suas variações
- **Serialização**: Técnicas de persistência de dados

### Design Patterns
- **Observer**: Para atualizações de interface
- **Command**: Para ações desfazer/refazer
- **Factory**: Para criação de diferentes tipos de nó
- **Singleton**: Para gerenciamento de estado global

### UX/UI Design
- **Design Systems**: Consistência visual
- **Micro-interações**: Feedback imediato
- **Information Architecture**: Organização de conteúdo
- **Usability Testing**: Validação com usuários

## 🤝 Contribuições

### Como Contribuir

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Guidelines

#### Código
- Siga as convenções TypeScript estabelecidas
- Adicione comentários JSDoc para funções públicas
- Mantenha consistência com o estilo existente
- Inclua testes para novas funcionalidades

#### Documentação
- Atualize o README para novas features
- Adicione exemplos de uso quando relevante
- Mantenha comentários no código atualizados
- Documente breaking changes


## 📄 Licença

Este projeto é desenvolvido para fins educacionais e está disponível sob a licença MIT. Você é livre para usar, modificar e distribuir o código, desde que mantenha os créditos originais.

## 👥 Créditos

- **Desenvolvimento**: Jhonata Ferreira
- **Design**: Sistema baseado em Material Design
- **Inspiração**: Ferramentas de customer journey mapping
- **Tecnologias**: TypeScript, HTML5, CSS3

---

**Desenvolvido para demonstrar o poder das estruturas de dados em aplicações reais.**

