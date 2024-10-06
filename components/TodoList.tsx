"use client";
import React, { useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

type Priority = "Low" | "Medium" | "High";

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: Priority;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    name: "",
    description: "",
    deadline: "",
    status: "Pending",
    priority: "Medium",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1,
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Deadline
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = priorityOrder[rowA.getValue(columnId) as Priority];
        const b = priorityOrder[rowB.getValue(columnId) as Priority];
        return a - b;
      },
      enableSorting: true,
      cell: ({ row }) => {
        const priority = row.original.priority;
        let color = "";

        if (priority === "Low")
          color = "bg-gray-500 text-white font-medium p-2 rounded-full";
        if (priority === "Medium")
          color = "bg-green-500 text-white font-medium p-2 rounded-full";
        if (priority === "High")
          color = "bg-red-500 text-white font-medium p-2 rounded-full";

        return <span className={color}>{priority}</span>;
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="space-x-2 text-nowrap">
          <Button
            onClick={() => {
              setEditingTask(row.original);
              setIsEditDialogOpen(true);
            }}
            className="bg-green-400 rounded-full"
          >
            Edit
          </Button>
          <Button
            // onClick={() => handleDelete(row.original.id)}
            onClick={() => {
              setTaskToDelete(row.original);
              setIsDeleteDialogOpen(true);
            }}
            className="bg-red-400 rounded-full"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleAddTask = () => {
    if (
      !newTask.name ||
      !newTask.description ||
      !newTask.deadline ||
      !newTask.priority
    ) {
      setErrorMessage("All fields are required!");
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
    };
    setTasks([...tasks, task]);
    setNewTask({
      name: "",
      description: "",
      deadline: "",
      status: "Pending",
      priority: "Medium",
    });
    setIsAddDialogOpen(false);
    setErrorMessage("");
  };

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
      );
      setEditingTask(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(event.target.value);
    },
    []
  );

  return (
    <div className="mx-auto p-4">
      <div className="mb-8 flex flex-col items-center justify-center bg-slate-700/30 p-12 rounded-2xl">
        <h1 className="text-3xl font-bold text-white">
          Welcome to the CRUD Application
        </h1>
        <p className="mt-2 text-lg text-white text-center text-wrap">
          This is a simple CRUD application where a person can add, edit and
          delete tasks. A User can view all tasks and sort them by priority.
          <br />
          <br />
          It is built with Next.js, Typescrit, React Tanstack Query/Table, Radix
          UI, Shadcn UI and Tailwind CSS.
        </p>
        <p className="mt-4 text-lg text-white text-center text-wrap">
          The application is designed to be simple and easy to use. It is a
          simple application to demonstrate the basics of a CRUD application.
        </p>
      </div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search tasks..."
          value={globalFilter ?? ""}
          onChange={handleSearch}
          className="max-w-sm ml-4  bg-slate-100 rounded-full border-2 border-slate-400"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full mr-4"
            >
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            className="bg-white"
          >
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newTask.name}
                    onChange={(e) =>
                      setNewTask({ ...newTask, name: e.target.value })
                    }
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Priority) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleAddTask}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                >
                  Add Task
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-green-500 ml-2 hover:bg-green-600 text-white rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="table-auto min-w-full bg-white border-2">
          <thead className="rounded-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 border-b border-gray-200 bg-black  text-xs leading-4 font-medium text-gray-500 tracking-wider text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-slate-600">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-black">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-no-wrap border-b text-white  border-gray-200 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="bg-white"
        >
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editingTask?.name ?? ""}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                value={editingTask?.description ?? ""}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editingTask?.deadline ?? ""}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, deadline: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={editingTask?.status}
                onValueChange={(
                  value: "Pending" | "In Progress" | "Completed"
                ) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, status: value } : null
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-priority" className="text-right">
                Priority
              </Label>
              <Select
                value={editingTask?.priority}
                onValueChange={(value: Priority) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, priority: value } : null
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleEditTask} className="bg-blue-500">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="mt-4">Are you sure you want to delete this task?</p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm
            </Button>
            <Button
              onClick={handleCancelDelete}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
