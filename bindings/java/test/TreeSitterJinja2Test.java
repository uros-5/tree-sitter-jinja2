import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.jinja2.TreeSitterJinja2;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterJinja2Test {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterJinja2.language()));
    }
}
