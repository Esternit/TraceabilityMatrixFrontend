import { TreeView, TreeDataItem } from "@/components/ui/tree-view";

function RequirementsTree({ requirements }) {
  const convertChildren = (children, dependencies) => {
    return children.map((child) => {
      return {
        id: child.name,
        name: child.toString(),
        children:
          dependencies.has(child.name) &&
          convertChildren(dependencies.get(child.name), dependencies),
      };
    });
  };
  const convertToTreeData = (requirements) => {
    console.log(requirements);
    let dependencies = new Map();
    let fullList = [];
    for (let i = 0; i < requirements.length; i++) {
      if (requirements[i].dependencies.length > 0) {
        for (let j = 0; j < requirements[i].dependencies.length; j++) {
          if (dependencies.has(requirements[i].dependencies[j].name)) {
            dependencies
              .get(requirements[i].dependencies[j].name)
              .push(requirements[i]);
          } else {
            dependencies.set(requirements[i].dependencies[j].name, [
              requirements[i],
            ]);
          }
        }
      }
      fullList.push(requirements[i]);
    }

    let res = [];

    fullList.forEach((requirement) => {
      if (requirement.dependencies.length == 0) {
        res.push({
          id: requirement.name,
          name: requirement.toString(),
          children:
            dependencies.has(requirement.name) &&
            convertChildren(dependencies.get(requirement.name), dependencies),
        });
      }
    });

    return res;
  };

  const treeData = convertToTreeData(requirements);

  return <TreeView data={treeData} />;
  //   return <div>tree</div>;
}

export default RequirementsTree;
