import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import './TaskDetails.css';

const TaskDetails = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Reset form data when task changes or when entering edit mode
    setFormData({
      title: task.title,
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      // categoryId will be handled later
    });
  }, [task, isEditing]);


  const handleDelete = async () => {
    if (window.confirm(`你确定要删除任务 "${task.title}" 吗？这个操作无法撤销。`)) {
      try {
        await api.deleteTask(task.id);
        onTaskDelete(task.id);
      } catch (error) {
        console.error("Failed to delete task", error);
        alert("删除任务失败！");
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.updateTask(task.id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      });
      onTaskUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save task", error);
      alert("保存失败！");
    }
  }

  // A helper function to format dates, can be moved to a utils file later
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <form className="task-details-container edit-mode" onSubmit={handleSave}>
         <div className="detail-item full-width">
            <label htmlFor="title" className="detail-label">标题</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="detail-input"/>
        </div>
        <div className="detail-item">
            <label htmlFor="dueDate" className="detail-label">截止日期</label>
            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="detail-input"/>
        </div>
         <div className="detail-item">
            <label htmlFor="priority" className="detail-label">优先级</label>
            <select name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="detail-input">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        {/* Category selector will be added here */}

        <div className="task-actions">
          <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>取消</button>
          <button type="submit" className="save-button">保存</button>
        </div>
      </form>
    )
  }

  return (
    <div className="task-details-container">
      <div className="detail-item">
        <span className="detail-label">截止日期:</span>
        <span className="detail-value">{formatDate(task.dueDate)}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">优先级:</span>
        <span className="detail-value">{task.priority || '未设置'}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">分类:</span>
        <span className="detail-value">{task.category?.name || '未分类'}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">获得积分:</span>
        <span className="detail-value">{task.points}</span>
      </div>

      <div className="subtask-section">
        <h4>子任务</h4>
        <div className="subtask-list">
          {task.subTasks && task.subTasks.length > 0 ? (
            task.subTasks.map(subtask => (
              <div key={subtask.id} className="subtask-item">
                <input type="checkbox" checked={subtask.completed} readOnly />
                <span>{subtask.title}</span>
              </div>
            ))
          ) : (
            <p className="no-subtasks">没有子任务。</p>
          )}
        </div>
      </div>

      <div className="task-actions">
          <button className="edit-button" onClick={() => setIsEditing(true)}>编辑</button>
          <button className="delete-button" onClick={handleDelete}>删除任务</button>
      </div>
    </div>
  );
};

export default TaskDetails;
