import { TodoService } from './todo.service';
import { GetPaginatedTodoDto } from './dto/get-paginated-todo.dto';
import { AddTodoDto } from './dto/add-todo.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    // UseInterceptors,
} from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { UpperAndFusionPipe } from '../pipes/upper-and-fusion.pipe';
// import { DurationInterceptor } from 'src/interceptors/duration.interceptor';

// @UseInterceptors(DurationInterceptor)
@Controller('todo')
export class TodoController {

    constructor(private todoService: TodoService) { }

    // @Get('v2')
    // getTodosV2(
    //   @Req() request: Request,
    //   @Res() response: Response
    // ) {
    //   console.log('Récupérer la liste des todos');
    //   response.status(205);
    //   response.json({
    //     contenu :  `Je suis une réponse générée à partir de l'objet Response de express`
    //   })
    // }

    // Récupérer la liste des Todos
    @Get()
    getTodos(
        //chak fois ke tu me trouve 1 element tu va me le transformer au @Type souhaiter(query body params)
        @Query() mesQueryParams: GetPaginatedTodoDto,
    ): Todo[] {
        return this.todoService.getTodos();
    }

    //Via son ID
    @Get('/:id')
    getTodoById(
        //en passant des param o pipe et le transform en integer
        @Param('id', new ParseIntPipe(
            {
                errorHttpStatusCode: HttpStatus.NOT_FOUND
            }
        )) id
    ) {
        return this.todoService.getTodoById(id);
    }

    @Post()
    addTodo(
        //a une method precise @Body(ValidationPipe) sinon partout==>ds main globalpipe
        @Body() newTodo: AddTodoDto
    ): Todo {
        return this.todoService.addTodo(newTodo);
    }

    // Supprimer un Todo via son id
    @Delete(':id')
    deleteTodo(
        @Param('id', ParseIntPipe) id
    ) {
        return this.todoService.deleteTodo(id);
    }

    @Put(':id')
    modifierTodo(
        @Param('id', ParseIntPipe) id,
        @Body() newTodo: Partial<AddTodoDto>
    ) {
        return this.todoService.updateTodo(id, newTodo);
    }

    @Post('pipe')
    testPipe(
        @Param('data', UpperAndFusionPipe) paramData,
        @Body() data
    ) {
        return data;
    }
}
