// @title Todo-List API
// @version 1.0
// @description This is a sample todo-list server.
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /api/v1

package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	cors "github.com/rs/cors/wrapper/gin"

	// for generate swagger ui
	_ "swag-example/docs"

	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

type Todo struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	Done      bool   `json:"done"`
	CreatedAt int64  `json:"created_at"`
}

var todos = make([]Todo, 0)

func MWHandleErrors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		err := c.Errors.Last()
		if err == nil {
			return
		}

		statusCode := c.Writer.Status()
		if statusCode == http.StatusOK {
			statusCode = http.StatusInternalServerError
		}

		c.AbortWithStatusJSON(statusCode, gin.H{
			"message": err.Error(),
		})
	}
}

func main() {
	r := gin.Default()
	r.Use(cors.AllowAll())
	r.Use(MWHandleErrors())
	v1 := r.Group("/api/v1")
	{
		todos := v1.Group("/todos")
		{
			todos.GET(":id", todoHandler)
			todos.GET("", listHandler)
			todos.POST("", addHandler)
			todos.DELETE(":id", deleteHandler)
			todos.PUT(":id", updateHandler)
		}
	}
	// must access /swagger/index.html
	// access /swagger will get 404
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	_ = r.Run()
}

// @Summary Show a single todo
// @Description get the single todo by ID
// @Produce json
// @Param id path string true "TODO ID"
// @Success 200 {object} Todo
// @Failure 404 "no content"
// @Router /todos/{id} [get]
func todoHandler(c *gin.Context) {
	id := c.Param("id")
	var todo *Todo
	for _, v := range todos {
		if v.ID == id {
			todo = &v
			break
		}
	}
	if todo == nil {
		c.Status(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, todo)
}

// @Summary Show all todos
// @Description get the list of todos
// @Produce json
// @Success 200 {array} Todo
// @Router /todos [get]
func listHandler(c *gin.Context) {
	c.JSON(http.StatusOK, todos)
}

type AddTodoReq struct {
	Content string `json:"content"`
}

// @Summary Add a new todo
// @Produce json
// @Param request body AddTodoReq true "Todo Content"
// @Success 200 {object} Todo
// @Router /todos [post]
func addHandler(c *gin.Context) {
	var req AddTodoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		_ = c.Error(err)
		return
	}

	todo := Todo{
		ID:        uuid.New().String(),
		Content:   req.Content,
		Done:      false,
		CreatedAt: time.Now().Unix(),
	}
	todos = append(todos, todo)
	c.JSON(http.StatusOK, todo)
}

// @Summary Delete a todo
// @Description delete a single todo by ID
// @Param id path string true "Todo ID"
// @Success 204 "no content"
// @Failure 404 "no content"
// @Router /todos/{id} [delete]
func deleteHandler(c *gin.Context) {
	id := c.Param("id")
	var todo *Todo
	var idx int
	for i, v := range todos {
		if v.ID == id {
			todo = &v
			idx = i
			break
		}
	}
	if todo == nil {
		c.Status(http.StatusNotFound)
		return
	}

	todos[idx] = todos[len(todos)-1]
	todos = todos[:len(todos)-1]
	c.Status(http.StatusNoContent)
}

type UpdateTodoReq struct {
	Content string `json:"content"`
	Done    bool   `json:"done"`
}

// @Summary Update a todo
// @Description update a single todo by ID
// @Param id path string true "Todo ID"
// @Param request body UpdateTodoReq true "Todo Body"
// @Success 204 "no content"
// @Failure 404 "no content"
// @Router /todos/{id} [put]
func updateHandler(c *gin.Context) {
	var req UpdateTodoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		_ = c.Error(err)
		return
	}

	id := c.Param("id")
	var todo *Todo
	var idx int
	for i, v := range todos {
		if v.ID == id {
			todo = &v
			idx = i
			break
		}
	}
	if todo == nil {
		c.Status(http.StatusNotFound)
		return
	}

	todos[idx].Content = req.Content
	todos[idx].Done = req.Done
	c.Status(http.StatusNoContent)
}
