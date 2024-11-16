import threading
from fastapi import WebSocket
from langchain_core.messages import HumanMessage
from agents.main_agent import initialize_agent


class AgentManager:
    def __init__(self):
        self.agents = {}  # Stores agent instances and configurations
        self.threads = {}  # Stores running threads

    def initialize_agent(self, user_id):
        """Initialize and return an agent instance."""
        agent_executor, config = initialize_agent(user_id)
        self.agents[user_id] = {"executor": agent_executor, "config": config}
        return agent_executor, config

    def start_agent(self, user_id, agent_executor, config):
        """Start an agent in a separate thread."""
        if user_id in self.threads:
            raise Exception(f"Agent {user_id} is already running.")

        thread = threading.Thread(
            target=self.run_chat_mode, args=(agent_executor, config, user_id)
        )
        thread.start()
        self.threads[user_id] = thread

    def stop_agent(self, user_id):
        """Stop an agent's thread."""
        if user_id in self.threads:
            del self.threads[user_id]

    def agent_chat(self, user_id, message):
        """Send a message to an agent."""
        agent_executor, config = (
            self.agents[user_id]["executor"],
            self.agents[user_id]["config"],
        )
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=message)]}, config
        ):
            print(chunk)

    def run_chat_mode(self, agent_executor, config, user_id):
        """Run an agent in chat mode."""
        print(f"Chat mode for agent {user_id} is ready.")

        # Run agent with the user's input in chat mode
        while True:
            user_input = input("Enter your message: ")
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")