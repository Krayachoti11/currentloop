package com.currentloop.backend.controller;

import com.currentloop.backend.model.Reply;
import com.currentloop.backend.repository.ReplyRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin(origins = "http://localhost:3000")
public class ReplyController {

    private final ReplyRepository replyRepository;

    public ReplyController(ReplyRepository replyRepository) {
        this.replyRepository = replyRepository;
    }

    @GetMapping("/{threadId}/replies")
    public List<Reply> getReplies(@PathVariable Long threadId) {
        return replyRepository.findByThreadId(threadId);
    }
}