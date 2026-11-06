interface TreeNode {
  name: string;
  isDir: boolean;
  children: Map<string, TreeNode>;
}

export function getFileIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "py":
      return "🐍";
    case "sql":
      return "📊";
    case "ts":
    case "tsx":
    case "js":
      return "📘";
    case "json":
    case "yaml":
    case "yml":
    case "toml":
      return "⚙";
    case "md":
      return "📝";
    default:
      return "📄";
  }
}

export function generateAsciiTree(
  paths: string[],
  rootName: string = "root",
  options: { includeIcons?: boolean } = { includeIcons: true }
): string {
  const includeIcons = options.includeIcons !== false;
  if (paths.length === 0) {
    return `${rootName}\n\n0 directories, 0 files`;
  }

  const root: TreeNode = {
    name: rootName,
    isDir: true,
    children: new Map(),
  };

  let dirCount = 0;
  let fileCount = 0;

  paths.forEach((pathStr) => {
    const parts = pathStr.split("/").filter(Boolean);
    let curr = root;

    parts.forEach((part, idx) => {
      const isLast = idx === parts.length - 1;
      if (!curr.children.has(part)) {
        if (!isLast) {
          dirCount++;
        } else {
          fileCount++;
        }
        curr.children.set(part, {
          name: part,
          isDir: !isLast,
          children: new Map(),
        });
      }
      curr = curr.children.get(part)!;
    });
  });

  const lines: string[] = [rootName];

  function renderChildren(node: TreeNode, prefix: string) {
    const entries = Array.from(node.children.values());
    // Sort directories first, then files
    entries.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });

    entries.forEach((child, index) => {
      const isLast = index === entries.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const icon = includeIcons ? (child.isDir ? "📁 " : `${getFileIcon(child.name)} `) : "";
      lines.push(`${prefix}${branch}${icon}${child.name}`);
      if (child.isDir) {
        const nextPrefix = prefix + (isLast ? "    " : "│   ");
        renderChildren(child, nextPrefix);
      }
    });
  }

  renderChildren(root, "");
  lines.push(`\n${dirCount} directories, ${fileCount} files`);
  return lines.join("\n");
}
