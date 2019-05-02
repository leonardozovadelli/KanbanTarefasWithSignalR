using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ListaTarefaKanban_Domain;
using ListaTarefaKanban_Repository;
using ListaTarefaKanban_Resitory;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ListaTarefaKanban_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarefasController : ControllerBase
    {
        private readonly IListaTarefaKanbanRepository _repo;

        public TarefasController(IListaTarefaKanbanRepository repo)
        {
            _repo = repo;
        }

        // GET TAREFAS STATUS
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await _repo.GetTarefaStatusAsync();
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }
        // GET TAREFAS POR RESPONSAVEL
        [HttpGet("{nome}")]
        public async Task<IActionResult> Get(string nome)
        {
            try
            {
                var results = await _repo.GetAllTarefaResponsavel(nome);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }

        [HttpGet("getId/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var results = await _repo.GetAllTarefasAsyncById(id);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }

        // POST TAREFAS
        [HttpPost]
        public async Task<IActionResult> Post(Tarefa model)
        {
            try
            {
                _repo.Add(model);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/tarefas/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }

            return BadRequest();
        }

        // // PUT 
        // [HttpPut("{responsavelNome}")]
        // public async Task<IActionResult> Put(string responsavelNome, Tarefa model)
        // {
        //     try
        //     {
        //         var evento = await _repo.GetAllTarefaResponsavel(responsavelNome);

        //         if (evento == null) return NotFound();

        //         _repo.Update(model);

        //         if (await _repo.SaveChangesAsync())
        //         {
        //             return Created($"/api/tarefas/{model.Responsavel.Nome}", model);
        //         }
        //     }
        //     catch (System.Exception)
        //     {
        //         return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
        //     }

        //     return BadRequest();
        // }

        [HttpPut("putId/{id}")]
        public async Task<IActionResult> Put(int id, Tarefa model)
        {
            try
            {
                var mudanca = await _repo.GetAllTarefasAsyncById(id);
                if (mudanca == null) return NotFound();

                _repo.Update(model);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/tarefas/putId/{model.Id}", model);
                }
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }
        // // DELETE 
        // [HttpDelete("{TarefaId}")]
        // public async Task<IActionResult> Delete(int TarefaId)
        // {
        //     try
        //     {
        //         var evento = await _repo.GetAllTarefaResponsavel(TarefaId);

        //         if (evento == null) return NotFound();

        //         _repo.Delete(evento);

        //         if (await _repo.SaveChangesAsync())
        //         {
        //             return Ok();
        //         }
        //     }
        //     catch (System.Exception)
        //     {
        //         return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
        //     }

        //     return BadRequest();
        // }

    }

}