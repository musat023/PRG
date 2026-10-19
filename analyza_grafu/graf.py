
class Graph:
    def __init__(self, directed=False):
        self.nodes = []
        self.edges = []
        self.directed = directed

    def add_node(self, node):
        if node not in self.nodes:
            self.nodes.append(node)

    def add_edge(self, a, b, weight=None):
        self.add_node(a)
        self.add_node(b)
        self.edges.append((a, b, weight))

    def analyze(self):
        print("Analyza grafu")
        print("Pocet uzlu:", len(self.nodes))
        print("Pocet hran:", len(self.edges))

        weighted = any(weight is not None for a, b, weight in self.edges)
        loops = any(a == b for a, b, weight in self.edges)

        print("Ohodnoceny:", "ano" if weighted else "ne")
        print("Orientovany:", "ano" if self.directed else "ne")
        print("Obsahuje smycky:", "ano" if loops else "ne")

        try:
            import networkx as nx

            g = nx.DiGraph() if self.directed else nx.Graph()
            g.add_nodes_from(self.nodes)

            for a, b, weight in self.edges:
                g.add_edge(a, b)

            print("Planarni:", "ano" if nx.check_planarity(g.to_undirected())[0] else "ne")

        except ImportError:
            print("Planaritu nelze overit bez knihovny networkx")

        neighbors = {node: set() for node in self.nodes}

        for a, b, weight in self.edges:
            if a != b:
                neighbors[a].add(b)
                neighbors[b].add(a)

        colors = {}

        def color_node(index, count):
            if index == len(self.nodes):
                return True

            node = self.nodes[index]

            for color in range(count):
                good = True

                for neighbor in neighbors[node]:
                    if colors.get(neighbor) == color:
                        good = False
                        break

                if good:
                    colors[node] = color

                    if color_node(index + 1, count):
                        return True

                    del colors[node]

            return False

        chromatic = 0

        for count in range(1, len(self.nodes) + 1):
            if color_node(0, count):
                chromatic = count
                break

        print("Chromaticke cislo:", chromatic)


g = Graph()

g.add_node("A")
g.add_node("B")
g.add_node("C")

g.add_edge("A", "B")
g.add_edge("B", "C")
g.add_edge("A", "C", 5)

g.analyze()
