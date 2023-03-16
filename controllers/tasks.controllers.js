import { pool } from "../db.js";


export const getTasks = async (req, res) => {
    try {
        console.log(3);
        console.log(req.user);
        const userId = req.user.id;
        console.log(4);
        const [result] = await pool.query(`SELECT * FROM users LEFT JOIN tasks ON users.id = tasks.user_id WHERE tasks.user_id=${userId}`);
        console.log("esto es result", result)
        console.log(5);
        res.json(result);
    }
    catch (error) {
        console.log("entra aca en error de getTask")
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getTask = async (req, res) => {
    const { id } = req.params;
    const [result] = await pool.query(`SELECT * FROM tasks WHERE id = ${id} ORDER BY create_at ASC`);
    try {
        if (result.length === 0) {
            return res.status(404).json({
                message: "No existe una tarea con ese id"
            })
        }
        res.json(result[0])
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createTask =
    async (req, res) => {
        try {
            const { title, description } = req.body;
            if (title === "") {
                return res.status(403).json({
                    message: "the task must have at least title"
                })
            }
            const [result] = await pool.query(`INSERT INTO tasks(title, description, user_id) VALUES (?, ?, ?)`, [title, description, req.user.id])
            return res.json({
                id: result.insertId,
                title: req.body.title,
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

export const updateTask = async (req, res) => {
    try {
        const result = await pool.query(`UPDATE tasks SET ? WHERE id = ?`, [
            req.body,
            req.params.id
        ]);
        if (result[0].changedRows === 0) {
            res.json({
                message: "nothing was changed"
            })
        }
        else {
            return res.json(result)
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(`DELETE FROM tasks WHERE id = ${id}`);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Not Found"
            })
        }
        else {
            return res.json({
                message: "Task deleted"
            })
        }

    }
    catch (error) {
        console.error(error)
    }
}